import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TablaContactosComponent } from './tabla-contactos.component';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';


const routes: Routes = [
    { path: '', component: TablaContactosComponent }
];

@NgModule({
    declarations: [
        TablaContactosComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ProgressSpinnerModule,
        ButtonModule,
        FormsModule,
        TableModule,
        PanelModule
    ],
    exports: [
        TablaContactosComponent
    ]
})
export class TablaContactosModule { }
