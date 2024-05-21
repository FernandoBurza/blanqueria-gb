import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../modules/auth/login/services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })

export class RoleGuard {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRole = route.data['expectedRole'];
    const role = localStorage.getItem('role');
    if (this.authService.isLoggedIn() && role !== expectedRole) {
        return false;
    }
    if (!this.authService.isLoggedIn() || role !== expectedRole) {
        this.router.navigate(['/auth/login']);
        return false;
    }
    console.log("Rol del usuario: " + role);
    return true;
  }
}

