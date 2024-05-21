import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportacionConsumosComponent } from './importacionConsumos.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ImportacionConsumosComponent,
                
              },
        ])],
    exports: [RouterModule]
})
export class ImportacionConsumosRoutingModule { }