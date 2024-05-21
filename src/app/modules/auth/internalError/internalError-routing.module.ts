import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InternalErrorComponent } from './internalError.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InternalErrorComponent }
    ])],
    exports: [RouterModule]
})
export class InternalErrorRoutingModule { }
