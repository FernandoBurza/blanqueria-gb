import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [` :host ::ng-deep .pi-eye,
             :host ::ng-deep .pi-eye-slash {
              transform: scale(1.6);
              margin-right: 1rem;
              color: #c1272d !important;
            }
          `],
  providers: [MessageService]
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage: string = "";
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.createReactiveRegisterForm();
  }

  private createReactiveRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  public onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    // Simular registro exitoso
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/auth/login']);
    }, 2000);
  }

  onRegisterWithGoogle() {
    // Lógica para registro con Google
    console.log('Registro con Google');
  }

  onRegisterWithOutlook() {
    // Lógica para registro con Outlook
    console.log('Registro con Outlook');
  }
}
