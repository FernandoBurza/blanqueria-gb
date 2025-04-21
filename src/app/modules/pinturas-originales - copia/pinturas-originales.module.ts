import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PinturasOriginalesComponent } from './pinturas-originales.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  { path: '', component: PinturasOriginalesComponent }
];

@NgModule({
  declarations: [
    PinturasOriginalesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProgressSpinnerModule,
    DialogModule,
    ButtonModule
  ],
  exports: [
    PinturasOriginalesComponent
  ]
})
export class PinturasOriginalesModule { }
