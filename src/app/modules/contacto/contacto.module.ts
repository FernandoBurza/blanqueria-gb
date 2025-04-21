import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './contacto.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { AccionComponent } from './components/accion.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
    { path: '', component: ContactoComponent }
];

@NgModule({
    declarations: [
        ContactoComponent, AccionComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ProgressSpinnerModule,
        ButtonModule,
        FormsModule,
        AutoCompleteModule,
        TableModule,
        DialogModule,
        DropdownModule
    ],
    exports: [
        ContactoComponent
    ]
})
export class ContactoModule { }
