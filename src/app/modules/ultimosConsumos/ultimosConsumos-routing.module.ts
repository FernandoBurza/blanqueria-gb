import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UltimosConsumosComponent } from './ultimosConsumos.component';
import { AccionComponent } from './components/accion/accion.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: UltimosConsumosComponent,
                children: [{
                    path: '',
                    redirectTo: 'accion',
                    pathMatch: 'full'
                  },
                  {
                    path: 'accion',
                    component: AccionComponent
                  },
                  
                ],
              },
        ])],
    exports: [RouterModule]
})
export class UltimosConsumosRoutingModule { }