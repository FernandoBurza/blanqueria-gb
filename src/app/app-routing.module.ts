import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppLayoutComponent } from './layout/app.layout.component';
import { WalletComponent } from './modules/wallet/wallet.component';
import { SuccessComponent } from './modules/success/success.component';
import { ContactoComponent } from './modules/contacto/contacto.component';

// Aquí puedes importar un guard de autenticación si lo tienes
// import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./general/components/dashboard/dashboard.module').then(m => m.DashboardModule),
        // Si usas un guard de autenticación, descomenta la siguiente línea
        // canActivate: [AuthGuard], 
      },

      {
        path: 'contacto',
        loadChildren: () => import('./modules/contacto/contacto.module').then(m => m.ContactoModule)
      },
      {
        path: 'tabla-contactos',
        loadChildren: () => import('./modules/tabla-contactos/tabla-contactos.module').then(m => m.TablaContactosModule)
      },
      { path: 'contacto/:id', component: ContactoComponent },




    ]
  },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
