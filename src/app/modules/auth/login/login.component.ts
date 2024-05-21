import { Component, HostListener } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [` :host ::ng-deep .pi-eye,
             :host ::ng-deep .pi-eye-slash {
              transform:scale(1.6);
              margin-right: 1rem;
              color: #c1272d !important;
            }
          `],
  providers: [MessageService]
})
export class LoginComponent {

  loginForm!: FormGroup;
  rememberMe: boolean = false;
  password!: string;
  errorMessage: string = "";
  loading: boolean = false;

  constructor(public layoutService: LayoutService, private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void 
  {
    this.createReactiveLoginForm();
    this.verifyCredentials();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.getModifierState('CapsLock')) {
      this.errorMessage = 'La tecla Bloq Mayús está activada.';
    } else {
      this.errorMessage = '';
    }
  }

  private createReactiveLoginForm(): void
  {
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  public onLogin(): void 
  {
    this.validateForm();

    this.loading = true;

    const user = this.loginForm.get('user')?.value;
    const password = this.loginForm.get('password')?.value;

    this.rememberCredentials(user, password);

    this.authService.login(user, password).subscribe({
      next: () => {
        this.successfulLogin();
      },
      error: (error: any) => {
        this.unsuccessfulLogin(error);
      }
    });
  }

  private validateForm(): void
  {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Ingrese usuario y contraseña, por favor!';
      return;
    }
  }

  private successfulLogin(): void 
  { //Le agrego un segundo de tiempo antes de redirigirse al dashbooard
    //para que el usuario aprecie el loading del botón Iniciar Sesión
    setTimeout(() =>{
      this.loading = false;
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  private unsuccessfulLogin(error: any): void 
  {
    this.loading = false;
    if (error != null) this.errorMessage = error.error.detail;
  }

  private rememberCredentials(user: string, password: string) : void
  {
    this.loginForm.get('rememberMe')?.value ? 
                   this.setUserLoggedToLocalStorage(user, password, 'true') :
                   this.setUserLoggedToLocalStorage('', '', '');
  }

  private verifyCredentials(): void{
    const userLogged = this.getUserLoggedFromLocalStorage();
    if(userLogged !== null)
    {
      this.loginForm.get('user')?.setValue(userLogged.user);
      this.loginForm.get('password')?.setValue(userLogged.password);
      this.loginForm.get('rememberMe')?.setValue(userLogged.rememberMe);
    }
  }

  private setUserLoggedToLocalStorage(user: string, password: string, rememberMe: string): void
  {
    localStorage.setItem('user', user);
    localStorage.setItem('password', password);
    localStorage.setItem('rememberMe', rememberMe);
  }

  private getUserLoggedFromLocalStorage(): any 
  {   
    return {
      user: localStorage.getItem('user'),
      password : localStorage.getItem('password'),
      rememberMe: this.stringToBoolean(localStorage.getItem('rememberMe')!)
    }
  }
  
  private stringToBoolean(value: string): boolean {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue === "true";
  }
}
