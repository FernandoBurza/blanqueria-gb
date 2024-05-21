import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs'
import { AdministracionTarjeta } from '../models/administracionTarjeta';
import { CombustibleTarjeta } from '../models/combustibleTarjeta';
import { TarjetaHistorico } from '../models/tarjetaHistorico';
import { ConsumosResponse } from '../models/consumosResponse';
import { ConsumosRequest } from '../models/consumosRequest';
import { MessageResponse } from '../models/messageResponse';

@Injectable({
  providedIn: 'root'
})

export class AdministracionTarjetasService {

  private controller = 'administracionTarjetas';
  private endpoint: string | undefined;

  
  constructor(private http:HttpClient) { 
    this.endpoint = `${environment.domain}${this.controller}`;
  }

  getData(): Observable<AdministracionTarjeta[]> {
    const url = `${this.endpoint}/GetData`;
    return this.http.get<AdministracionTarjeta[]>(url); 
  }

  getHistoricalData(numeTarj :string): Observable<TarjetaHistorico[]> {
    const params = new HttpParams()
      .set('numeTarj', numeTarj || '0');
      const url = `${this.endpoint}/GetHistoricalData`;
    return this.http.get<TarjetaHistorico[]>(url, { params });  
  }

  Insert(requestData: CombustibleTarjeta): Observable<MessageResponse> {
    const url = `${this.endpoint}/InsertData`;
    return this.http.post<MessageResponse>(url, requestData);
  }
  
  Update(requestData: CombustibleTarjeta): Observable<MessageResponse> {
    const url = `${this.endpoint}/UpdateData`;
    return this.http.post<MessageResponse>(url, requestData);
  }

  Disable(numeIden: number): Observable<MessageResponse> {
    const url = `${this.endpoint}/DisableCard`;
    return this.http.post<MessageResponse>(url, numeIden);
  }

  Deliver(requestData: CombustibleTarjeta): Observable<MessageResponse> {
    const url = `${this.endpoint}/DeliverCard`;
    return this.http.post<MessageResponse>(url, requestData);
  }

  Receive(requestData: CombustibleTarjeta): Observable<MessageResponse> {
    const url = `${this.endpoint}/ReceiveCard`;
    return this.http.post<MessageResponse>(url, requestData);
  }

  Consumption(request: ConsumosRequest): Observable<ConsumosResponse> {
    const url = `${this.endpoint}/ConsumptionCard`;
    return this.http.post<ConsumosResponse>(url, request);
  }

  Clone(requestData: CombustibleTarjeta): Observable<MessageResponse> {
    const url = `${this.endpoint}/CloneCard`;
    return this.http.post<MessageResponse>(url, requestData);
  }

}
