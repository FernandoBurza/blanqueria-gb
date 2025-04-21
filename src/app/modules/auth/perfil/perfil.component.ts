import { Component, OnInit } from '@angular/core';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseAuth } from 'src/app/firebase-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: User | null = null;
  isSignUpMode = false;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    onAuthStateChanged(firebaseAuth, (user) => {
      this.user = user;
    });
  }

  logout() {
    signOut(firebaseAuth).then(() => {
      this.router.navigate(['/dashboard']);
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
