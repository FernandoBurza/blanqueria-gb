import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Localidad } from 'src/app/shared/entities/localidad';
import { Cuotas } from '../entities/cuotas';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'accion',
    templateUrl: './accion.component.html',
    styleUrls: ['./accion.component.scss'],
    providers: [DatePipe],
})
export class AccionComponent {
    accion!: string;
    titulo!: string;
    listaLocalidad: Localidad[] = [];
    filteredLocalidad: Localidad[] = [];
    selectedLocalidadAdvanced!: Localidad;
    messageDialog: boolean = false;
    messageText: string = '';
    generalError: string = '';
    header: string = '';
    confirmarDialog: boolean = false;
    aplicarDialog: boolean = false;
    cuotas: Cuotas[] = [];
    idCliente: number = 0;
    selectedModalidad: number = -1;
    selectedMetodo: number = -1;
    selectedCuota: number = -1;
    total: number = 0
    idVenta: number = 0;

    formData: any = {
        idMetodo: 0,
        idModalidad: 0,
        cuotas: 0,
        total: 0
    };

    modalidadOptions = [
        { label: 'Seleccionar', value: -1 },
        { label: 'Mensual', value: 1 },
        { label: 'Quinsenal', value: 2 },
        { label: 'Semanal', value: 3 },
    ];

    metodoOptions = [
        { label: 'Seleccionar', value: -1 },
        { label: 'Efectivo', value: 1 },
        { label: 'MercadoPago', value: 2 },
    ];

    cuotaOptions = [
        { label: 'Seleccionar', value: -1 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
    ];

    constructor(
        public router: Router,
        public ref: DynamicDialogRef,
        @Inject(DynamicDialogConfig) public config: DynamicDialogConfig,
        private firestoreService: FirestoreService
    ) { }

    ngOnInit() {
        this.titulo = this.config.data.titulo;
        this.idCliente = this.config.data.idCliente
    }

    onModalidadChange(event: any) {
        this.selectedModalidad = event.value;
        this.formData.idModalidad = this.selectedModalidad;
    }

    onMetodoChange(event: any) {
        this.selectedMetodo = event.value;
        this.formData.idMetodo = this.selectedMetodo;
    }

    onCuotaChange(event: any) {
        this.selectedCuota = event.value;
        this.formData.cuotas = this.selectedCuota;
    }

    seleccionOpcion(evento: any) {
        const selectedItem = evento.value;
        if (selectedItem) {
        }
    }

    filterLocalidad(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.listaLocalidad.length; i++) {
            const localidad = this.listaLocalidad[i];
            if (
                localidad.nombre != undefined &&
                localidad.nombre!.toLowerCase().indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(localidad);
            }
        }

        this.filteredLocalidad = filtered;
    }

    async guardar() {
        this.generalError = '';

        if (this.selectedModalidad == -1) {
            this.generalError = 'Debe seleccionar una modalidad';
            return;
        }

        if (this.selectedMetodo == -1) {
            this.generalError = 'Debe seleccionar un metodo';
            return;
        }

        if (this.selectedCuota == -1) {
            this.generalError = 'Debe seleccionar la cantidad de cuotas';
            return;
        }

        if (this.formData.total == 0) {
            this.generalError = 'El monto no puede ser 0';
            return;
        }
        else await this.guardarDatos(this.idCliente);

    }

    cancelar() {
        this.confirmarDialog = true;
        this.header = 'CANCELAR';
        this.messageText =
            '¿Desea <B>descartar</B> la creación de la venta?';
    }

    guardarDatos(idVenta: number) {
        const { idMetodo, idModalidad, cuotas, total } = this.formData;

        // Crear el objeto de venta
        const venta = {
            idVenta: idVenta,
            idCliente: this.idCliente,
            idMetodo: idMetodo,
            idModalidad: idModalidad,
            total: total,
            cuotas: cuotas,
            fechaCreacion: new Date(),
        };

        // Guardar la venta en la colección 'venta'


        this.firestoreService.generateId().subscribe(idVenta => {
            // Ahora puedes usar el idVenta generado
            console.log('Nuevo ID de venta:', idVenta);

            // Crear el objeto de venta
            const venta = {
                idVenta: idVenta,
                idCliente: this.idCliente,
                idMetodo: this.formData.idMetodo,
                idModalidad: this.formData.idModalidad,
                total: this.formData.total,
                cuotas: this.formData.cuotas,
                fechaCreacion: new Date(),
            };

            // Ahora guardar la venta
            this.firestoreService.addVenta(venta).subscribe({
                next: () => {
                    // Después de guardar la venta, guardar los detalles de la venta
                    this.guardarDetallesVenta(idVenta, this.formData.cuotas, this.formData.total, this.formData.idModalidad);
                },
                error: (error) => {
                    console.error('Error al guardar la venta:', error);
                }
            });
        });

    }

    // Función para guardar los detalles de la venta
    guardarDetallesVenta(idVenta: number, cuotas: number, total: number, idModalidad: number) {
        const montoCuota = parseFloat((total / cuotas).toFixed(2));
        const diasASumar = this.obtenerDiasSegunModalidad(idModalidad);

        for (let i = 0; i < cuotas; i++) {
            const fechaVencimiento = new Date();
            fechaVencimiento.setDate(fechaVencimiento.getDate() + i * diasASumar);

            const idCuota = i + 1;

            const detalleVenta = {
                idVenta: idVenta,
                idCuota: idCuota,
                montoCuota: montoCuota,
                fechaVencimiento: fechaVencimiento,
                pagada: false,
                fechaPago: null
            };

            // Guardar el detalle en la colección 'detalleVenta' con el idCuota
            this.firestoreService.addDetalleVenta(detalleVenta).subscribe({
                next: () => {
                    // Acción cuando la solicitud se completa exitosamente (puedes dejarlo vacío si no se necesita hacer nada aquí)
                },
                error: (error) => {
                    console.error('Error al guardar el detalle de la venta:', error);
                    this.messageDialog = true;
                    this.messageText = 'Error al guardar el detalle de la venta: ' + error;
                }
            });
        }

        this.messageDialog = true;
        this.messageText = "Cambios guardados!";
    }

    aceptarMensaje() {
        this.messageDialog = false;
        this.ref.close();
    }

    confirmar() {
        this.confirmarDialog = false;
        this.ref.close();
    }

    async aplicar() {
        this.aplicarDialog = false;
    }

    seguirEditando() {
        this.confirmarDialog = false;
        this.aplicarDialog = false;
    }

    actualizarCuotas() {
        const { total, cuotas, idModalidad } = this.formData;

        if (cuotas > 0 && total > 0) {
            const montoParcial = parseFloat((total / cuotas).toFixed(2));
            this.cuotas = [];

            const diasASumar = this.obtenerDiasSegunModalidad(idModalidad);

            for (let i = 0; i < cuotas; i++) {
                const fechaCuota = new Date();
                fechaCuota.setDate(fechaCuota.getDate() + i * diasASumar);
                const fechaFormateada = fechaCuota.toLocaleDateString('es-AR');

                this.cuotas.push({
                    monto: montoParcial,
                    fechaVencimiento: fechaFormateada,
                    pagada: false
                });
            }
        } else {
            this.cuotas = [];
        }
    }

    obtenerDiasSegunModalidad(modalidad: number): number {
        switch (modalidad) {
            case 3: return 7;
            case 2: return 15;
            case 1: return 30;
            default: return 30;
        }
    }

}
