import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [            
            {
                label: 'OERACIONES',
                items: [
                    { label: 'PANELES MADERA', icon: 'pi pi-fw pi-bookmark', routerLink: ['/paneles-madera'] },
                    { label: 'IMPORTACIÓN DE CONSUMOS', icon: 'pi pi-fw pi-bookmark', routerLink: ['/importacionConsumos'] },                    
                    { label: 'ANULACIÓN DE CONSUMOS', icon: 'pi pi-fw pi-bookmark', routerLink: ['/anulacionCosnumos'] }                    
                ]
            },
            {
                label: 'INFORMES',
                items: [
                    { label: 'LIQUIDACIONES', icon: 'pi pi-fw pi-bookmark', routerLink: ['/dashboard'] },
                    { label: 'ÚLTIMOS CONSUMOS', icon: 'pi pi-fw pi-bookmark', routerLink: ['/dashboard'] },
                    
                ]
            }
        ];
    }
}
