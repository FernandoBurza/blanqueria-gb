import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private requestCount = 0;
  private ignoreRequests = false; // Añadido para ignorar ciertas solicitudes

  startLoading() {
    if (this.ignoreRequests) {
      return;
    }

    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  stopLoading() {
    if (this.ignoreRequests) {
      return;
    }

    this.requestCount--;
    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  // Añadido para configurar si se deben ignorar las solicitudes
  setIgnoreRequests(ignore: boolean) {
    this.ignoreRequests = ignore;
  }
}
