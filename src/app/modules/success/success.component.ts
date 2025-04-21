// success.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
})
export class SuccessComponent implements OnInit {
    paymentStatus: string = '';
    paymentId: string = '';

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        // Obtener parámetros de la URL (como 'status' y 'payment_id')
        this.route.queryParams.subscribe(params => {
            this.paymentStatus = params['status']; // Puede ser 'approved'
            this.paymentId = params['payment_id']; // ID del pago si está disponible
        });
    }
}
