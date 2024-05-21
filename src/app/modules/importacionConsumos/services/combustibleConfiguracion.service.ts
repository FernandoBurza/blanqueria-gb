import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable, catchError, throwError} from 'rxjs'
import { Configuracion } from '../models/Configuracion';

@Injectable({
  providedIn: 'root'
})

export class CombustibleConfiguracionService {

  private controller = 'combustibleConfiguracion';
  private endpoint: string | undefined;

  
  constructor(private http:HttpClient) { 
    this.endpoint = `${environment.domain}${this.controller}`;
  }

  getData(): Observable<Configuracion[]> {
    const url = `${this.endpoint}/GetData`;
    return this.http.get<Configuracion[]>(url); 
  }

}
