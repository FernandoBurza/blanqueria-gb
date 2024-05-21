import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs'
import { Liquidacion } from '../models/liquidacion';

@Injectable({
  providedIn: 'root'
})

export class LiquidacionesService {

  private controller = 'liquidaciones';
  private endpoint: string | undefined;

  
  constructor(private http:HttpClient) { 
    this.endpoint = `${environment.domain}${this.controller}`;
  }

  
  getData(fechPeri :string | null): Observable<Liquidacion[]> {
    const params = new HttpParams()
      .set('fechPeri', fechPeri || '');
      const url = `${this.endpoint}/GetData`;
    return this.http.get<Liquidacion[]>(url, { params });  
  }

}
