import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PinturasOriginalesService {
  private baseUrl = environment.domain;  // Usamos el dominio desde el environment

  constructor(private http: HttpClient) { }

  obtenerPinturas(): Observable<any> {
    return this.http.get(`${this.baseUrl}pinturas/get`);
  }

  obtenerPinturaPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}pinturas/get/${id}`);
  }


}
