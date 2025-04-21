import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { NavigationEnd, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


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
    private router: Router,
    private afAuth: AngularFireAuth  // Inyectar AngularFireAuth
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute();
      }
    });
  }

  checkRoute() {
    if (this.router.url === '/dashboard')
      this.esDashboard = true;
    else
      this.esDashboard = false;
  }

  sesionPerfil() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['/perfil']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.router.navigate(['/dashboard']);
  }
}
