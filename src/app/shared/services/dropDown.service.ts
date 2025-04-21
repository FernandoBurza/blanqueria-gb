import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { DropDownList } from 'src/app/Interfaces/dropDownList';

@Injectable({
  providedIn: 'root'
})

export class DropDownService {
  private controller = 'dropDown';
  private endpoint: string | undefined;

  constructor(private http:HttpClient) {
    this.endpoint = `${environment.domain}${this.controller}`;
  }

  get(entidad: string, filtroCompania?: number, numePresFono?: number): Observable<DropDownList[]> {
    let params = new HttpParams();
    params = params.append('entidad', entidad);
    if (filtroCompania !== null && filtroCompania !== undefined) {
      params = params.append('numeComp', filtroCompania.toString());
    }
    if (numePresFono !== null && numePresFono !== undefined) {
      params = params.append('numePresFono', numePresFono.toString());
    }

    return this.http.get<any[]>(`${this.endpoint}/get`, { params });
  }
  
}
