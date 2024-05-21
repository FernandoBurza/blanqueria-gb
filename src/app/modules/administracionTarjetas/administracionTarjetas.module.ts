import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
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
import { AdministracionTarjetasRoutingModule } from './administracionTarjetas-routing.module';
import { AccionComponent } from './components/accion/accion.component';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { BlockViewerComponent } from './components/blockviewer/blockviewer.component';
import { AdministracionTarjetasComponent } from './administracionTarjetas.component';
import { StepsModule } from 'primeng/steps';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

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
        AdministracionTarjetasRoutingModule,
        StepsModule,
        ProgressBarModule,
        InputNumberModule,
        AutoCompleteModule,
        RadioButtonModule,
        DynamicDialogModule
        
    ],
    declarations: [AdministracionTarjetasComponent, BlockViewerComponent, AccionComponent ],
    exports: []
})
export class AdministracionTarjetasModule { }
