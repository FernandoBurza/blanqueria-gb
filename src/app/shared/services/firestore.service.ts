import { Injectable } from '@angular/core';
import { Firestore, collection, doc, collectionData, query, where, getDocs, Timestamp, orderBy, getDoc } from '@angular/fire/firestore';
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

  constructor(private firestore: Firestore) { }

  getLocalidades(): Observable<Localidad[]> {
    const localidadesCollection = collection(this.firestore, 'localidades');
    return collectionData(localidadesCollection, { idField: 'id' }) as Observable<Localidad[]>;
  }

  getContactoPorId(id: number): Observable<any[]> {
    const clienteCollection = collection(this.firestore, 'cliente');
    const q = query(clienteCollection, where('id', '==', id));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => doc.data()))
    );
  }

  getCuotas(idCliente: number): Observable<Cuotas[]> {
    const ventasCollection = collection(this.firestore, 'venta');
    const qVentas = query(ventasCollection, where('idCliente', '==', idCliente));

    return from(getDocs(qVentas)).pipe(
      switchMap(ventasSnapshot => {
        const ventas = ventasSnapshot.docs.map(doc => doc.data() as { idVenta: number });

        const detalleObservables = ventas.map(venta => {
          const detalleCollection = collection(this.firestore, 'detalleVenta');
          const qDetalles = query(detalleCollection, where('idVenta', '==', venta.idVenta), orderBy('fechaVencimiento'));
          return collectionData(qDetalles).pipe(
            map((detalles: any[]) => {
              return detalles.map(detalle => ({
                monto: detalle.montoCuota,
                fechaVencimiento: (detalle.fechaVencimiento as Timestamp)?.toDate()?.toLocaleDateString('es-AR') || null,
                pagada: detalle.pagada,
                fechaPago: (detalle.fechaPago as Timestamp)?.toDate()?.toLocaleDateString('es-AR') || null
              }) as Cuotas);
            })
          );
        });
        return combineLatest(detalleObservables);
      }),
      map(detallesPorVenta => detallesPorVenta.flat())
    );
  }

  getDatosVenta(idCliente: number): Observable<Venta[]> {
    const ventasCollection = collection(this.firestore, 'venta');
    const qVentas = query(ventasCollection, where('idCliente', '==', idCliente));

    return from(getDocs(qVentas)).pipe(
      switchMap(ventasSnapshot => {
        const ventas = ventasSnapshot.docs.map(doc => doc.data() as any);

        const ventasObservables = ventas.map(venta => {
          const metodoDocRef = doc(this.firestore, 'metodosPago', String(venta.idMetodo ?? ''));
          const metodoDoc$ = from(getDoc(metodoDocRef)).pipe(
            map(docSnap => docSnap.exists() ? (docSnap.data() as { nombre?: string })?.nombre ?? 'Desconocido' : 'Desconocido'),
            catchError(err => {
              console.error('Error al obtener método de pago:', err);
              return of('Desconocido');
            })
          );

          const modalidadDocRef = doc(this.firestore, 'modalidadesPago', String(venta.idModalidad ?? ''));
          const modalidadDoc$ = from(getDoc(modalidadDocRef)).pipe(
            map(docSnap => docSnap.exists() ? (docSnap.data() as { nombre?: string })?.nombre ?? 'Desconocida' : 'Desconocida'),
            catchError(err => {
              console.error('Error al obtener modalidad:', err);
              return of('Desconocida');
            })
          );

          const detalleCollection = collection(this.firestore, 'detalleVenta');
          const qDetalles = query(detalleCollection, where('idVenta', '==', venta.idVenta), orderBy('fechaVencimiento'));
          const cuotas$ = collectionData(qDetalles).pipe(
            map(cuotas => cuotas.map(cuota => ({
              ...cuota,
              fechaVencimiento: (cuota['fechaVencimiento'] as Timestamp)?.toDate?.() ?? null,
              fechaPago: (cuota['fechaPago'] as Timestamp)?.toDate?.() ?? null
            })))
          );

          return combineLatest([metodoDoc$, modalidadDoc$, cuotas$]).pipe(
            map(([metodoNombre, modalidadNombre, detalleVenta]) => ({
              idVenta: venta.idVenta,
              idCliente: venta.idCliente,
              metodo: metodoNombre,
              modalidad: modalidadNombre,
              cuotas: venta.cuotas ?? 1,
              total: venta.total ?? 0,
              detalleVenta: detalleVenta
            } as Venta))
          );
        });
        return combineLatest(ventasObservables);
      })
    );
  }

  getHistorial(): Observable<any[]> {
    const clientesCollection = collection(this.firestore, 'cliente');
    return collectionData(clientesCollection, { idField: 'id' }).pipe(
      switchMap(clientes => {
        const historialObservables = clientes.map(cliente => {
          const localidadDocRef = doc(this.firestore, 'localidades', String(cliente['localidad']));
          return from(getDoc(localidadDocRef)).pipe(
            switchMap(localidadDoc => {
              const localidadNombre = localidadDoc.exists() ? (localidadDoc.data() as { nombre: string })?.nombre : 'Desconocida';

              const ventasCollection = collection(this.firestore, 'venta');
              const qVentas = query(ventasCollection, where('idCliente', '==', cliente.id));
              return from(getDocs(qVentas)).pipe(
                switchMap(ventasSnapshot => {
                  const ventas = ventasSnapshot.docs.map(doc => doc.data() as { idVenta: number });

                  if (ventas.length === 0) {
                    return of({
                      id: cliente.id,
                      nombre: cliente['nombre'],
                      localidad: localidadNombre,
                      telefono: cliente['telefono'],
                      fechaVencimiento: null
                    });
                  }

                  const detalleObservables = ventas.map(venta => {
                    const detalleCollection = collection(this.firestore, 'detalleVenta');
                    const qDetalles = query(detalleCollection, where('idVenta', '==', venta.idVenta), where('pagada', '==', false));
                    return collectionData(qDetalles) as Observable<DetalleVenta[]>;
                  });

                  return combineLatest(detalleObservables).pipe(
                    map((cuotasPorVenta: DetalleVenta[][]) => {
                      const todasLasCuotas = cuotasPorVenta.flat();

                      if (todasLasCuotas.length === 0) return null;

                      const proximaCuota = todasLasCuotas.reduce((min, actual) => {
                        const fechaMin = (min.fechaVencimiento as Timestamp)?.toDate();
                        const fechaAct = (actual.fechaVencimiento as Timestamp)?.toDate();
                        if (!fechaMin) return actual;
                        if (!fechaAct) return min;
                        return fechaAct < fechaMin ? actual : min;
                      });

                      return {
                        id: cliente.id,
                        nombre: cliente['nombre'],
                        localidad: localidadNombre,
                        telefono: cliente['telefono'],
                        fechaVencimiento: (proximaCuota.fechaVencimiento as Timestamp)?.toDate()?.toISOString().split('T')[0]
                      };
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
    const contactoCollection = collection(this.firestore, 'cliente');
    return addDoc(contactoCollection, contacto);
  }

  async actualizarContacto(id: string, contacto: DetalleContacto): Promise<void> {
    const clienteCollection = collection(this.firestore, 'cliente');
    const q = query(clienteCollection, where('id', '==', id));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      const contactoDocRef = doc(this.firestore, 'cliente', docId);

      // Crea un objeto literal con los campos que quieres actualizar
      const updateData: { [key: string]: any } = {
        nombre: contacto.nombre,
        telefono: contacto.telefono,
        // ... incluye aquí otros campos de DetalleContacto que quieras actualizar
      };

      return updateDoc(contactoDocRef, updateData);
    } else {
      throw new Error('No se encontró el contacto con el id proporcionado.');
    }
  }

  addVenta(venta: any) {
    const ventaDocRef = doc(this.firestore, 'venta', venta.idVenta.toString());
    return setDoc(ventaDocRef, venta);
  }

  addDetalleVenta(detalleVenta: any) {
    const detalleCollection = collection(this.firestore, 'detalleVenta');
    return addDoc(detalleCollection, detalleVenta);
  }

  async updateDetalleVenta(cuotaActualizada: any): Promise<void> {
    const detalleCollection = collection(this.firestore, 'detalleVenta');
    const q = query(detalleCollection, where('idCuota', '==', cuotaActualizada.idCuota));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach(docSnap => {
        const docRef = doc(this.firestore, 'detalleVenta', docSnap.id);
        updateDoc(docRef, {
          montoCuota: cuotaActualizada.montoCuota,
          fechaVencimiento: cuotaActualizada.fechaVencimiento, // Asegúrate de que sea un tipo aceptado por Firestore (Timestamp o Date)
          pagada: cuotaActualizada.pagada,
          fechaPago: cuotaActualizada.fechaPago
        });
      });
    } else {
      console.log('No se encontró ningún documento con el idCuota especificado.');
    }
  }

  generateId(): Observable<number> {
    const ventaCollection = collection(this.firestore, 'venta');
    const q = query(ventaCollection, orderBy('idVenta', 'desc'), limit(1));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const lastVenta = snapshot.docs[0].data() as { idVenta: number };
          return lastVenta.idVenta + 1;
        } else {
          return 1;
        }
      })
    );
  }

  contactoId(): Observable<number> {
    const clienteCollection = collection(this.firestore, 'cliente');
    const q = query(clienteCollection, orderBy('id', 'desc'), limit(1));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const lastCliente = snapshot.docs[0].data() as { id: number };
          return lastCliente.id + 1;
        } else {
          return 1;
        }
      })
    );
  }
}

// Importa las funciones necesarias de la API modular
import { from } from 'rxjs';
import { addDoc, setDoc, updateDoc, limit } from '@firebase/firestore';