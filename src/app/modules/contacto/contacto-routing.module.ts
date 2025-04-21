import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccionComponent } from './components/accion.component';
import { ContactoComponent } from './contacto.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ContactoComponent,
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
export class BuscarServicioRoutingModule { }