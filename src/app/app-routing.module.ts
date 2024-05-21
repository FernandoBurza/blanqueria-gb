import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from "./layout/app.layout.component";

const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
    {
      path: '',
      component: AppLayoutComponent,
      children: [
        { path: 'dashboard', loadChildren: () => import('./general/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
        { path: 'importacionConsumos', loadChildren: () => import('./modules/importacionConsumos/importacionConsumos.module').then(m => m.ImportacionConsumosModule) },
        { path: 'anulacionConsumos', loadChildren: () => import('./modules/anulacionConsumos/anulacionConsumos.module').then(m => m.AnulacionConsumosModule) },
        { path: 'administracionTarjetas', loadChildren: () => import('./modules/administracionTarjetas/administracionTarjetas.module').then(m => m.AdministracionTarjetasModule) },
        { path: 'liquidaciones', loadChildren: () => import('./modules/liquidaciones/liquidaciones.module').then(m => m.LiquidacionesModule) },
        { path: 'ultimosConsumos', loadChildren: () => import('./modules/ultimosConsumos/ultimosConsumos.module').then(m => m.UltimosConsumosModule) },        
      ]
    },
    { path: '**', redirectTo: '/notfound' },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }