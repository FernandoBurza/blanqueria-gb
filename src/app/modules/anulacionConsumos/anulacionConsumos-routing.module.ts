import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnulacionConsumosComponent } from './anulacionConsumos.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AnulacionConsumosComponent,
                children: [{
                    path: '',
                    redirectTo: 'accion',
                    pathMatch: 'full'
                  }                  
                ],
              },
        ])],
    exports: [RouterModule]
})
export class AnulacionConsumosRoutingModule { }