import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GtcProcessedResponse } from '../models/gtc-processed-response';

@Injectable({
  providedIn: 'root'
})
export class GtcNotificationService 
{
  private _listener = new Subject<any>();
  private _showDivSubject = new Subject<boolean>();

  listen(): Observable<any> {
    return this._listener.asObservable();
  }

  filter(response: GtcProcessedResponse[]) {
    this._listener.next(response);
  }

  showDiv(): Observable<boolean> {
    return this._showDivSubject.asObservable();
  }

  updateShowDiv(show: boolean) {
    this._showDivSubject.next(show);
  }
}
