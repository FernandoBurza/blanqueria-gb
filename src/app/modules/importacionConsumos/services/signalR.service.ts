import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

import { environment } from 'src/environments/environment';
import { ProcessingStep } from '../models/processing-step';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hub = 'GTC-hub';
  private endpoint: string | undefined;
  private hubConnection?: signalR.HubConnection;
  public processingSteps?: ProcessingStep[] = [];
  public messageError: string = '';
  
  constructor() {
    this.endpoint = `${environment.domain}${this.hub}`;
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(`${this.endpoint}`)
                            .withAutomaticReconnect()
                            .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Conexión signalR exitosa');
        this.joinGroup('GTC');
      })
      .catch(err => console.log('Error durante la inicialización: ' + err))
  }

  public joinGroup = (groupName: string) => {
    this.hubConnection?.invoke('JoinGroup', groupName)
      .catch(err => console.error(err));
  }

  public addTransferChartDataListener = () => {
    this.hubConnection?.on('ProcessingStatus', (data) => {
      console.log(data);
      if(!this.findIdAtArray(data.id)){
        this.processingSteps?.push(data);
      }
      else {
        this.updateStatusById(data);
      }
    });
  }

  public addTransferErrorListener = () => {
    this.hubConnection?.on('ProcessingErrors', (data) => {
      console.log(data);
      this.messageError = data;
    });
  }

  private findIdAtArray(id: number): boolean {
    return this.processingSteps!.some(x => x.id === id);
  }

  private updateStatusById(data: any): void {
    const objIndex = this.processingSteps?.findIndex(x => x.id === data.id);

    if (objIndex === -1) {
      return;
    }
    this.processingSteps![objIndex!].percentage = data.percentage;
    this.processingSteps![objIndex!].isProcessingCompleted = data.isProcessingCompleted;
    this.processingSteps![objIndex!].processingTime = data.processingTime;
    this.processingSteps![objIndex!].hasFailed = data.hasFailed;
  }
  
}
