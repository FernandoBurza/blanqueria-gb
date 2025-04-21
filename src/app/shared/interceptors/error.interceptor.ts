import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PopupService } from '../services/popup.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private popupService: PopupService,
  ) {
    
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.url.includes("/login")) {
          return throwError(() => error);
        }

        switch (error.status) {          
          case 400:
          case 503:
            console.error('Se produjo un error:', error);
            this.popupService.closeAllPopups();
            this.router.navigate(['/auth/error']);
            break;
          case 401:
          case 403:
            console.error('Se produjo un error:', error);
            this.popupService.closeAllPopups();
            this.router.navigate(['/auth/access']);
            break;
          case 500:
            console.error('Se produjo un error:', error);
            this.popupService.closeAllPopups();
            this.router.navigate(['/auth/internalError']);
            break;
          default:
            console.error('Error no manejado:', error);
            this.popupService.closeAllPopups();
            this.router.navigate(['/auth/error']);
            break;
        }

        return throwError(() => error);
      }),
      finalize(() => {
        // Aquí podrías manejar lógica de finalización si es necesario
      })
    );
  }
  
}
