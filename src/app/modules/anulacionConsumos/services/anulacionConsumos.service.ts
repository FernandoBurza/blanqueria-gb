import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs'
import { AnulacionConsumosRequest } from '../models/anulacionConsumosRequest';
import { MessageResponse } from '../models/messageResponse';
import { DropDownList } from '../models/dropDownList';


@Injectable({
  providedIn: 'root'
})

export class AnulacionConsumosService {

  private controller = 'anulacionConsumo';
  private endpoint: string | undefined;

  
  constructor(private http:HttpClient) { 
    this.endpoint = `${environment.domain}${this.controller}`;
  }


  getData(requestData :AnulacionConsumosRequest): Observable<number> {
    const params = new HttpParams()
      .set('numePres', requestData.numePres || 0)
      .set('fechPeri', requestData.fechPeri || '');
      const url = `${this.endpoint}/GetData`;
    return this.http.get<number>(url, {params});  
  }

  cancelConsumption(requestData :AnulacionConsumosRequest): Observable<MessageResponse> {
    const url = `${this.endpoint}/CancelConsumption`;
    return this.http.post<MessageResponse>(url, requestData);
  }

  getPrestadores(): Observable<DropDownList[]> {    
    return this.http.get<any[]>(`${this.endpoint}/getPrestadores`);
  }

}
