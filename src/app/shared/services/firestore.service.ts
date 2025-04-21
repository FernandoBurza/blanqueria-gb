import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, forkJoin, lastValueFrom, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Cuotas } from 'src/app/modules/contacto/entities/cuotas';
import { Cliente } from '../entities/cliente';
import { DetalleVenta } from '../entities/detalleVenta';
import { Localidad } from '../entities/localidad';
import { Venta } from 'src/app/modules/contacto/entities/venta';
import { DetalleContacto } from 'src/app/modules/contacto/entities/detalleContacto';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }


  getLocalidades(): Observable<Localidad[]> {
    return this.firestore.collection('localidades').snapshotChanges().pipe(
      map(snapshot =>
        snapshot
          .map(doc => doc.payload.doc.data() as Localidad)
      )
    );
  }

  getContactoPorId(id: number): Observable<any[]> {
    return this.firestore.collection('cliente', ref => ref.where('id', '==', id)).snapshotChanges().pipe(
      map(snapshot => snapshot.map(doc => doc.payload.doc.data()))
    );
  }

  getCuotas(idCliente: number): Observable<Cuotas[]> {
    return this.firestore.collection('venta', ref => ref.where('idCliente', '==', idCliente)).snapshotChanges().pipe(
      switchMap(ventasSnapshot => {
        const ventas = ventasSnapshot.map(v => {
          const data = v.payload.doc.data() as any;
          return data.idVenta;
        });

        const detalleObservables = ventas.map(idVenta =>
          this.firestore.collection('detalleVenta', ref => ref.where('idVenta', '==', idVenta).orderBy('fechaVencimiento'))
            .valueChanges()
            .pipe(
              map((detalles: any[]) => {
                return detalles.map(detalle => ({
                  monto: detalle.montoCuota,
                  fechaVencimiento: detalle.fechaVencimiento.toDate()?.toLocaleDateString('es-AR') || null,
                  pagada: detalle.pagada,
                  fechaPago: detalle.fechaPago?.toDate()?.toLocaleDateString('es-AR') || null
                }) as Cuotas);
              })
            )
        );

        return combineLatest(detalleObservables);
      }),
      map(detallesPorVenta => detallesPorVenta.flat())
    );

  }

  getDatosVenta(idCliente: number): Observable<Venta[]> {
    return this.firestore.collection('venta', ref => ref.where('idCliente', '==', idCliente))
      .get()
      .pipe(
        switchMap(ventasSnapshot => {
          const ventas = ventasSnapshot.docs.map(doc => doc.data() as any);

          const ventasObservables = ventas.map(venta => {
            const idMetodo = String(venta.idMetodo ?? '');

            const metodoDoc$ = this.firestore.collection('metodosPago', ref =>
              ref.where('id', '==', idMetodo)
            )
              .snapshotChanges()
              .pipe(
                map(snapshot => {
                  const doc = snapshot[0]?.payload.doc;
                  const data = doc?.data() as { nombre?: string } | undefined;
                  return data?.nombre ?? 'Desconocido';
                }),
                catchError(err => {
                  console.error('Error al obtener método de pago:', err);
                  return of('Desconocido');
                })
              );


            const idModalidad = String(venta.idModalidad ?? '');

            const modalidadDoc$ = this.firestore.collection('modalidadesPago', ref =>
              ref.where('id', '==', idModalidad)
            )
              .snapshotChanges()
              .pipe(
                map(snapshot => {
                  const doc = snapshot[0]?.payload.doc;
                  const data = doc?.data() as { nombre?: string } | undefined;
                  return data?.nombre ?? 'Desconocida';
                }),
                catchError(err => {
                  console.error('Error al obtener modalidad:', err);
                  return of('Desconocida');
                })
              );
            const cuotas$ = this.firestore.collection<DetalleVenta>('detalleVenta', ref =>
              ref.where('idVenta', '==', venta.idVenta).orderBy('fechaVencimiento')
            ).valueChanges().pipe(
              map(cuotas => cuotas.map(cuota => ({
                ...cuota,
                fechaVencimiento: cuota.fechaVencimiento?.toDate?.() ?? null,
                fechaPago: cuota.fechaPago?.toDate?.() ?? null
              })))
            );

            return combineLatest([metodoDoc$, modalidadDoc$, cuotas$]).pipe(
              map(([metodoNombre, modalidadNombre, cuotas]) => ({
                idVenta: venta.idVenta,
                idCliente: venta.idCliente,
                metodo: metodoNombre,
                modalidad: modalidadNombre,
                cuotas: venta.cuotas ?? 1,
                total: venta.total ?? 0,
                detalleVenta: cuotas
              } as Venta))
            );
          });

          return combineLatest(ventasObservables);
        })
      );
  }

  getHistorial(): Observable<any[]> {
    return this.firestore.collection<Cliente>('cliente').valueChanges().pipe(
      switchMap(clientes => {
        const historialObservables = clientes.map(cliente => {
          // Primero buscamos la localidad del cliente
          return this.firestore.collection('localidades').doc(String(cliente.localidad)).get().pipe(
            switchMap(localidadDoc => {
              const data = localidadDoc.data() as { nombre: string } | undefined;
              const localidadNombre = localidadDoc.exists && data ? data.nombre : 'Desconocida';

              // Ahora buscamos las ventas del cliente
              return this.firestore.collection('venta', ref => ref.where('idCliente', '==', cliente.id)).get().pipe(
                switchMap(ventasSnapshot => {
                  const ventas = ventasSnapshot.docs.map(doc => doc.data());

                  // Si no tiene ventas, devolver un valor por defecto
                  if (ventas.length === 0) {
                    return of({
                      id: cliente.id,
                      nombre: cliente.nombre,
                      localidad: localidadNombre,
                      telefono: cliente.telefono,
                      fechaVencimiento: null
                    });
                  }

                  const detalleObservables = ventas.map((venta: any) => {
                    return this.firestore.collection<DetalleVenta>('detalleVenta', ref =>
                      ref.where('idVenta', '==', venta.idVenta).where('pagada', '==', false)
                    ).valueChanges();
                  });

                  return combineLatest(detalleObservables).pipe(
                    switchMap((cuotasPorVenta: DetalleVenta[][]) => {
                      const todasLasCuotas = cuotasPorVenta.flat();

                      if (todasLasCuotas.length === 0) return [null];

                      const proximaCuota = todasLasCuotas.reduce((min, actual) => {
                        const fechaMin = min.fechaVencimiento.toDate();
                        const fechaAct = actual.fechaVencimiento.toDate();
                        return fechaAct < fechaMin ? actual : min;
                      });

                      return of({
                        id: cliente.id,
                        nombre: cliente.nombre,
                        localidad: localidadNombre,
                        telefono: cliente.telefono,
                        fechaVencimiento: proximaCuota.fechaVencimiento.toDate().toISOString().split('T')[0]
                      });
                    })
                  );
                })
              );
            })
          );
        });

        return combineLatest(historialObservables);
      }),
      map(historial => historial.filter(entry => entry !== null))
    );
  }



  agregarContacto(contacto: DetalleContacto) {
    return this.firestore.collection('cliente').add(contacto);
  }

  actualizarContacto(id: string, contacto: DetalleContacto) {
    return this.firestore.collection('cliente', ref =>
      ref.where('id', '==', id)
    )
      .get()
      .toPromise()
      .then(snapshot => {
        if (!snapshot!.empty) {
          const docId = snapshot!.docs[0].id; // ID real del documento
          return this.firestore.collection('cliente').doc(docId).update(contacto);
        } else {
          throw new Error('No se encontró el contacto con el id proporcionado.');
        }
      });
  }

  addVenta(venta: any) {
    return this.firestore.collection('venta').doc(venta.idVenta.toString()).set(venta);
  }

  // Función para agregar un detalle de venta
  addDetalleVenta(detalleVenta: any) {
    return this.firestore.collection('detalleVenta').add(detalleVenta);
  }

  updateDetalleVenta(cuotaActualizada: any): Promise<void> {
    return this.firestore.collection('detalleVenta', ref => ref.where('idCuota', '==', cuotaActualizada.idCuota))
      .get()
      .toPromise()
      .then(querySnapshot => {
        if (!querySnapshot!.empty) {
          querySnapshot!.forEach(doc => {
            doc.ref.update({
              montoCuota: cuotaActualizada.montoCuota,
              fechaVencimiento: cuotaActualizada.fechaVencimiento,  // Asegúrate de que esta sea una fecha válida
              pagada: cuotaActualizada.pagada,
              fechaPago: cuotaActualizada.fechaPago
            });
          });
        } else {
          console.log('No se encontró ningún documento con el idCuota especificado.');
        }
      })
      .catch(error => {
        console.error('Error al actualizar el detalle de la venta:', error);
      });
  }


  // Generar un ID único para la venta (puedes utilizar el método de Firebase o crear el tuyo propio)
  generateId(): Observable<number> {
    return this.firestore
      .collection('venta', ref => ref.orderBy('idVenta', 'desc').limit(1))
      .get()
      .pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            const lastVenta = snapshot.docs[0].data() as any;
            return lastVenta.idVenta + 1;  // Devolver el siguiente ID
          } else {
            // No hay ventas previas, empezamos con 1
            return 1;
          }
        })
      );
  }

  contactoId(): Observable<number> {
    return this.firestore
      .collection('cliente', ref => ref.orderBy('id', 'desc').limit(1))
      .get()
      .pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            const lastVenta = snapshot.docs[0].data() as any;
            return lastVenta.id + 1;  // Devolver el siguiente ID
          } else {
            // No hay ventas previas, empezamos con 1
            return 1;
          }
        })
      );
  }
}