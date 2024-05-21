import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable, catchError, throwError} from 'rxjs'
import { Configuracion } from '../models/Configuracion';
import { ImportacionConsumosRequest } from '../models/ImportacionConsumosRequest';

@Injectable({
  providedIn: 'root'
})

export class ImportacionConsumosService {

  private controller = 'importacionConsumos';
  private endpoint: string | undefined;

  
  constructor(private http:HttpClient) { 
    this.endpoint = `${environment.domain}${this.controller}`;
  }

  insertData(datosAGrabar: ImportacionConsumosRequest[]): Observable<any> {
    const url = `${this.endpoint}/InsertData`;
    return this.http.post(url, datosAGrabar);
  }

}
