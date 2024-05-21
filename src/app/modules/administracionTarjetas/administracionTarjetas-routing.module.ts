import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdministracionTarjetasComponent } from './administracionTarjetas.component';
import { AccionComponent } from './components/accion/accion.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdministracionTarjetasComponent,
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
export class AdministracionTarjetasRoutingModule { }