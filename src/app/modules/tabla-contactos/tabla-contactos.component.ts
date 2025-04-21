import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Historial } from './entitties/historial';


@Component({
    selector: 'app-tabla-contactos',
    templateUrl: './tabla-contactos.component.html',
    styleUrls: ['./tabla-contactos.component.css']
})
export class TablaContactosComponent {
    cuotas: Historial[] = [];
    globalFilterValue: string = '';

    constructor(private router: Router, private firestoreService: FirestoreService) { }

    ngOnInit() {
        this.traerCuotas();
    }

    traerCuotas() {
        this.firestoreService.getHistorial().subscribe({
            next: (response) => {
                // Ordenar: primero los sin fecha, luego por fecha ascendente
                this.cuotas = response.sort((a, b) => {
                    if (!a.fechaVencimiento && !b.fechaVencimiento) return 0;
                    if (!a.fechaVencimiento) return -1; // a no tiene fecha → primero
                    if (!b.fechaVencimiento) return 1;  // b no tiene fecha → primero

                    // Ambos tienen fecha → ordenar ascendente
                    return new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime();
                });
            },
            error: (error) => console.error('Error al obtener historial:', error),
        });
    }


    verMas(id: number) {
        this.router.navigate(['/contacto', id]);
    }

    getRowClass(fechaVencimiento?: Date): string {
        if (!fechaVencimiento) {
            return 'bg-purple-100 text-purple-800';
        }

        const fecha = new Date(fechaVencimiento);
        const hoy = new Date();
        const diffEnMs = fecha.getTime() - hoy.getTime();
        const diffDias = Math.ceil(diffEnMs / (1000 * 60 * 60 * 24));

        if (diffDias <= 3) {
            return 'bg-red-100 text-red-800';
        } else if (diffDias <= 7) {
            return 'bg-yellow-100 text-yellow-800';
        } else {
            return '';
        }
    }

}
