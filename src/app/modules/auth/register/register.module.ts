import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModule } from '../login/login.module';



@NgModule({
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ButtonModule,
        PasswordModule,
        MessageModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }
