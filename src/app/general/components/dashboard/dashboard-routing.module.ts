import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        //{ path: 'importacionConsumos', component: ImportacionConsumosComponent },
      ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
