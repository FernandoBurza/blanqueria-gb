import { Component } from '@angular/core';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseApp } from 'src/app/firebase-config';
import { Router } from '@angular/router';  // Para la redirección

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email!: string;
  password!: string;
  isSignUpMode: boolean = false;
  confirmPassword!: string;
  errorMessage: string = '';
  name!: string;

  constructor(private router: Router) {
    // Firebase ya está inicializado en firebase-config.ts
  }

  login(): void {
    const auth = getAuth(firebaseApp);  // Asegúrate de usar la instancia de Firebase ya inicializada
    this.errorMessage = ''; // Resetear mensaje de error antes de cada intento
    if (this.isSignUpMode) {
      // Si está en modo de registro, crear una nueva cuenta
      this.register(auth);
    } else {
      // Si está en modo de login, iniciar sesión
      this.signIn(auth);
    }
  }

  signIn(auth: any): void {
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        console.log('User logged in with email:', userCredential.user);
        this.router.navigate(['/dashboard']);  // Redirigir a otra página después de iniciar sesión
      })
      .catch((error) => {
        console.error('Error during login:', error);
        this.errorMessage = this.getErrorMessage(error.code);  // Mostrar el error correspondiente
      });
  }

  register(auth: any): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;  // No registramos si las contraseñas no coinciden
    }

    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        console.log('User registered:', userCredential.user);
        // Actualizar el nombre del usuario en Firebase
        updateProfile(userCredential.user, {
          displayName: this.name
        }).then(() => {
          console.log('Nombre del usuario actualizado');
        }).catch((error) => {
          console.error('Error actualizando nombre:', error);
        });
        this.router.navigate(['/dashboard']);  // Redirigir a otra página después de registrarse
      })
      .catch((error) => {
        console.error('Error during registration:', error);
        this.errorMessage = this.getErrorMessage(error.code);  // Mostrar el error correspondiente
      });
  }

  loginWithGoogle(): void {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(firebaseApp);  // Usa la instancia de Firebase inicializada
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('User signed in with Google:', result);
        this.router.navigate(['/dashboard']);  // Redirigir a otra página después de iniciar sesión con Google
      })
      .catch((error) => {
        console.error('Error during Google sign in:', error);
        this.errorMessage = this.getErrorMessage(error.code);  // Mostrar el error correspondiente
      });
  }

  toggleSignUp() {
    this.isSignUpMode = !this.isSignUpMode;
  }

  // Método para traducir el error de Firebase Auth
  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'El usuario no existe';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está en uso';
      case 'auth/invalid-email':
        return 'Correo electrónico inválido';
      default:
        return 'Ocurrió un error. Inténtalo de nuevo';
    }
  }
}
