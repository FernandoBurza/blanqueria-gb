import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

/* Basado en los tutoriales:
    - https://www.positronx.io/angular-jwt-user-authentication-tutorial/ 
    - https://www.youtube.com/watch?v=9IBNIbgMGdM
*/

 export class AuthService {
    
    private jwtTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('jwtToken') || '');
    private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('refreshToken') || '');
    private roleSubject: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('role') || '');
    
    private endpoint: string | undefined;
    private controller: string = 'auth';

    get jwtToken(): Observable<string> {
      return this.jwtTokenSubject.asObservable();
    }
  
    get refreshToken(): Observable<string> {
      return this.refreshTokenSubject.asObservable();
    }

    constructor(private httpClient: HttpClient) {
      this.endpoint = `${environment.domain}${this.controller}`;
    }
  
    login(user: string, password: string) {
      let loginRequest: LoginRequest = { username: user, password: password }
        
      return this.httpClient
        .post<LoginResponse>(`${this.endpoint}/login`, loginRequest)
        .pipe(
            map(response => 
            {
                localStorage.setItem('jwtToken', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);

                localStorage.setItem('role', 'Admin');

                this.jwtTokenSubject.next(response.token);
                this.refreshTokenSubject.next(response.refreshToken);
                this.roleSubject.next('Admin');
            })
        );
    }
    
    isLoggedIn(): boolean {
        return !!localStorage.getItem('jwtToken');
    }
      
    refresh() {
        const url = `${this.endpoint}/validateRefreshToken?refreshToken=${localStorage.getItem('refreshToken')}`;
        return this.httpClient.patch<any>(url, {})
        .pipe(map(response => {
          localStorage.setItem('jwtToken', response.jwtToken);
          this.jwtTokenSubject.next(response.jwtToken);
        }));
    }
  
    logout() {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      this.jwtTokenSubject.next('');
      this.refreshTokenSubject.next('');
      this.roleSubject.next('');
    }
}