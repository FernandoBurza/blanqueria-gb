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
import { AnulacionConsumosRoutingModule } from './anulacionConsumos-routing.module';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { BlockViewerComponent } from './components/blockviewer/blockviewer.component';
import { AnulacionConsumosComponent } from './anulacionConsumos.component';
import { StepsModule } from 'primeng/steps';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';

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
        AnulacionConsumosRoutingModule,
        StepsModule,
        ProgressBarModule,
        InputNumberModule,
        AutoCompleteModule,
        RadioButtonModule,
        DynamicDialogModule,
        InputMaskModule
        
    ],
    declarations: [AnulacionConsumosComponent, BlockViewerComponent ],
    exports: []
})
export class AnulacionConsumosModule { }
