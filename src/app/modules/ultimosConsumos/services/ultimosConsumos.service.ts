import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs'
import { CombustibleConsumo } from '../models/combustibleConsumo';

@Injectable({
  providedIn: 'root'
})

export class UltimosConsumosService {

  private controller = 'ultimosConsumos';
  private endpoint: string | undefined;

  constructor(private http:HttpClient) { 
    this.endpoint = `${environment.domain}${this.controller}`;
  }

  getData(): Observable<CombustibleConsumo[]> {
    const url = `${this.endpoint}/GetData`;
    return this.http.get<CombustibleConsumo[]>(url); 
  }

  
}

