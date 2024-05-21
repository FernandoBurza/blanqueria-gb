import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LiquidacionesComponent } from './liquidaciones.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: LiquidacionesComponent,
                
              },
        ])],
    exports: [RouterModule]
})
export class LiquidacionesRoutingModule { }