import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { firebaseAuth } from 'src/app/firebase-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<User | null>(null);
  authState$: Observable<User | null> = this.authStateSubject.asObservable();

  constructor(private router: Router) {
    // Suscribirse a los cambios del estado de autenticación
    onAuthStateChanged(firebaseAuth, (user) => {
      this.authStateSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(firebaseAuth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  get currentUser(): Observable<User | null> {
    return this.authState$;
  }
}
