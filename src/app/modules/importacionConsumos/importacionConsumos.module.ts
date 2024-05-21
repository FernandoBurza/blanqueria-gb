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
import { ImportacionConsumosRoutingModule } from './importacionConsumos-routing.module';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { BlockViewerComponent } from './components/blockviewer/blockviewer.component';
import { ImportacionConsumosComponent } from './importacionConsumos.component';
import { StepsModule } from 'primeng/steps';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import { OrderListModule } from 'primeng/orderlist';
import { ListboxModule } from 'primeng/listbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PickListModule } from 'primeng/picklist'
import { DataViewModule } from 'primeng/dataview'

import { ProcessTimelineGtcComponent } from './components/process-timeline-gtc/process-timeline-gtc.component';

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
        ImportacionConsumosRoutingModule,
        StepsModule,
        ProgressBarModule,
        FileUploadModule,
        OrderListModule,
        ListboxModule,
        DragDropModule,
        PickListModule,
        DataViewModule,
    ],
    declarations: [ImportacionConsumosComponent, BlockViewerComponent, ProcessTimelineGtcComponent ],
    exports: []
})
export class ImportacionConsumosModule { }
