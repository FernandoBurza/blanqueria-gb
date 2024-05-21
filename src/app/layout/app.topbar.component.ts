import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../modules/auth/login/services/auth.service';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [`
    :host ::ng-deep {
      .c-icons {
          width: 1.75rem;
          height: 1.75rem;
      }
      .administracionTarjetas-icon {
        background-image: url("../../assets/gtc/images/administracionTarjetas.svg");
      }
      .importacionConsumos-icon {
        background-image: url("../../assets/gtc/images/importacionConsumos.svg");
      }
      .anulacionConsumos-icon {
        background-image: url("../../assets/gtc/images/anulacionConsumos.svg");
      }
      .liquidaciones-icon {
        background-image: url("../../assets/gtc/images/liquidaciones.svg");
      }
      .ultimosConsumos-icon {
        background-image: url("../../assets/gtc/images/ultimosConsumos.svg");
      }
      
    }
  `]
})
export class AppTopBarComponent implements OnInit {
    items!: MenuItem[];
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;
    routeItems: MenuItem[] = [];
    esDashboard:boolean = false;

    constructor(public layoutService: LayoutService, private authService: AuthService, private router: Router) { 
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

    ngOnInit(){
        
        this.routeItems = [            
        { label: 'ADMINISTRACIÓN DE TARJETAS', icon: 'c-icons administracionTarjetas-icon', routerLink: ['/administracionTarjetas'] },
        { label: 'IMPORTACIÓN DE CONSUMOS', icon: 'c-icons importacionConsumos-icon', routerLink: ['/importacionConsumos'] },                    
        { label: 'ANULAR', icon: 'c-icons anulacionConsumos-icon', routerLink: ['/anulacionConsumos'] },                    
        { label: 'LIQUIDACIONES', icon: 'c-icons liquidaciones-icon', routerLink: ['/liquidaciones'] },
        { label: 'ÚLTIMOS CONSUMOS', icon: 'c-icons ultimosConsumos-icon', routerLink: ['/ultimosConsumos'] },
        ];

        this.items = [
            {
                label: 'Opciones',
                items: [
                    {
                        label: 'Cerrar sesión',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            this.logout();
                        }
                    }
                ]
            }
        ]
       
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
