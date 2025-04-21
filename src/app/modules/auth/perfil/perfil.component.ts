import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserInfo } from 'firebase/auth';
import { AuthService } from '../login/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  user: UserInfo | null = null;
  isSignUpMode = false;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }

}
