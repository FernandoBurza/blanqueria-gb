import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { UltimosConsumosRoutingModule } from './ultimosConsumos-routing.module';
import { AccionComponent } from './components/accion/accion.component';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { BlockViewerComponent } from './components/blockviewer/blockviewer.component';
import { UltimosConsumosComponent } from './ultimosConsumos.component';
import { StepsModule } from 'primeng/steps';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        RippleModule,
        ChipModule,
        CheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        TooltipModule,    
        TagModule,
        DividerModule,
        DropdownModule,
        ToastModule,
        DialogModule,
        MessageModule,
        ImageModule,
        DividerModule,
        TableModule,
        UltimosConsumosRoutingModule,
        StepsModule,
        ProgressBarModule
    ],
    declarations: [UltimosConsumosComponent, BlockViewerComponent, AccionComponent ],
    exports: []
})
export class UltimosConsumosModule { }
