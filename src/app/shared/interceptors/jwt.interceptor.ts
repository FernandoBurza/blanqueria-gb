import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/login/services/auth.service';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.jwtToken.pipe(
      take(1),
      switchMap(jwtToken => {
        if (jwtToken) {
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${jwtToken}` }
          });
        }
        return next.handle(request);
      })
    );
  }
}