import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalErrorRoutingModule } from './internalError-routing.module';

import { ButtonModule } from 'primeng/button';
import { InternalErrorComponent } from './internalError.component';

@NgModule({
    imports: [
        CommonModule,
        InternalErrorRoutingModule,
        ButtonModule
    ],
    declarations: [InternalErrorComponent]
})
export class InternalErrorModule { }
