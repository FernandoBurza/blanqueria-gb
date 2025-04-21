import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  setDoc,
  getDoc,
  limit
} from '@angular/fire/firestore';
import { combineLatest, from, Observable, of } from 'rxjs';
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

  private firestore: Firestore = inject(Firestore);


  getLocalidades(): Observable<Localidad[]> {
    const col = collection(this.firestore, 'localidades');
    return collectionData(col, { idField: 'id' }).pipe(
      map((data: any[]) => {
        return data.map(doc => {
          return {
            id: doc['id'],  // Usamos la sintaxis de corchetes para acceder al 'id'
            ...doc          // Añadimos las demás propiedades del documento
          } as Localidad;
        });
      })
    );
  }

  getContactoPorId(id: number): Observable<any[]> {
    // Comentamos el código actual y devolvemos un observable vacío
    return of([]); // Retorna un arreglo vacío como si no hubiera contactos
  }

  getCuotas(idCliente: number): Observable<Cuotas[]> {
    // Comentamos la lógica actual y devolvemos un observable vacío
    return of([]); // Retorna un arreglo vacío como si no hubiera cuotas
  }

  getDatosVenta(idCliente: number): Observable<Venta[]> {
    // Comentamos la lógica actual y devolvemos un observable vacío
    return of([]); // Retorna un arreglo vacío como si no hubiera ventas
  }

  getHistorial(): Observable<any[]> {
    // Comentamos la lógica actual y devolvemos un observable vacío
    return of([]); // Retorna un arreglo vacío como si no hubiera historial
  }

  agregarContacto(contacto: DetalleContacto) {
    // Comentamos la lógica actual y devolvemos una promesa resuelta
    return of(undefined); // Simula que se ha agregado el contacto correctamente
  }

  actualizarContacto(id: string, contacto: DetalleContacto) {
    // Comentamos la lógica actual y devolvemos una promesa resuelta
    return of(undefined); // Simula que se ha actualizado el contacto correctamente
  }

  addVenta(venta: any) {
    // Comentamos la lógica actual y devolvemos una promesa resuelta
    return of(undefined); // Simula que se ha agregado la venta correctamente
  }

  addDetalleVenta(detalleVenta: any) {
    // Comentamos la lógica actual y devolvemos una promesa resuelta
    return of(undefined); // Simula que se ha agregado el detalle de la venta correctamente
  }

  updateDetalleVenta(cuotaActualizada: any): Promise<void> {
    // Comentamos la lógica actual y devolvemos una promesa resuelta
    return Promise.resolve(); // Simula que se ha actualizado el detalle de la venta correctamente
  }

  generateId(): Observable<number> {
    // Comentamos la lógica actual y devolvemos un valor por defecto
    return of(1); // Retorna el ID 1 como si fuera el siguiente ID generado
  }

  contactoId(): Observable<number> {
    // Comentamos la lógica actual y devolvemos un valor por defecto
    return of(1); // Retorna el ID 1 como si fuera el siguiente ID de contacto
  }
}
