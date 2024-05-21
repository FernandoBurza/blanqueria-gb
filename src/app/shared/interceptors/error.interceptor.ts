import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log('interceptor Error');
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (req.url.includes("/login")) {
            return throwError(error);
        } 
        if(error.status === 400 || error.status === 503){
          console.error('Se produjo un error:', error);
          this.router.navigate(['/auth/error']);
        }   
        if (error.status === 401 || error.status === 403) {
          console.error('Se produjo un error:', error);
          this.router.navigate(['/auth/access']); 
        }
        if(error.status === 500){
          console.error('Se produjo un error:', error);
          this.router.navigate(['/auth/internalError']);
        }
        if (error.status === 0 || error.status === -1) {
          console.error('No se pudo establecer una conexión con el servidor.');
          this.router.navigate(['/auth/access']);
        }
        //el status en 0, al parecer es cuando el backend está de baja (validarlo y hacer )
        return EMPTY;
      })
    );
  }
}


