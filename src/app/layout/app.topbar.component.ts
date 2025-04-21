import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { NavigationEnd, Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from 'src/app/firebase-config';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  items!: MenuItem[];
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  esDashboard: boolean = false;

  constructor(
    public layoutService: LayoutService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute();
      }
    });
  }

  checkRoute() {
    this.esDashboard = this.router.url === '/dashboard';
  }

  sesionPerfil() {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        this.router.navigate(['/perfil']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    // Acá podrías usar signOut(firebaseAuth) si querés cerrar sesión real
    this.router.navigate(['/dashboard']);
  }
}
