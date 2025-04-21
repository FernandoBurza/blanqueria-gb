import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { DetalleContacto } from './entities/detalleContacto';
import { Localidad } from 'src/app/shared/entities/localidad';
import { Venta } from './entities/venta';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PopupService } from 'src/app/shared/services/popup.service';
import { AccionComponent } from './components/accion.component';

@Component({
    selector: 'app-contacto',
    templateUrl: './contacto.component.html',
    styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

    detalleContacto: DetalleContacto = {} as DetalleContacto;
    formData: any = {
        nombre: '',
        direccion: '',
        telefono: '',
        descripcionFachada: '',
        id: '',
    };

    messageDialog: boolean = false;
    messageText: string = '';
    header: string = '';
    id: number = 0;
    listaLocalidad: Localidad[] = [];
    filteredLocalidad: Localidad[] = [];
    selectedLocalidadAdvanced!: Localidad;
    ventas: Venta[] = [];
    expandedRows: { [key: string]: boolean } = {};
    generalError: string = '';

    constructor(private route: ActivatedRoute, private firestoreService: FirestoreService, public dialogService: DialogService, private popupService: PopupService, private router: Router, @Optional() public ref: DynamicDialogRef
    ) { }

    ngOnInit() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.traerLocalidades();
        this.buscarContactoPorId();
        this.buscarVenta();
    }

    traerLocalidades() {
        this.firestoreService
            .getLocalidades()
            .subscribe((listaLocalidad: Localidad[]) => {
                this.listaLocalidad = listaLocalidad;
            });
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

    buscarContactoPorId() {
        this.firestoreService.getContactoPorId(this.id).subscribe({
            next: (response) => {
                this.detalleContacto = response[0];

                this.formData.id = this.detalleContacto.id;
                this.formData.nombre = this.detalleContacto.nombre;
                this.formData.direccion = this.detalleContacto.direccion;
                this.formData.telefono = this.detalleContacto.telefono;
                this.formData.descripcionFachada = this.detalleContacto.descripcionFachada;

                this.selectedLocalidadAdvanced = this.listaLocalidad.find(
                    (item) => item.id == Number(this.detalleContacto.localidad)
                )!;
            },
            error: (error) => {
                console.error('Error al obtener contacto:', error);
            },
        });
    }

    buscarVenta() {
        this.firestoreService.getDatosVenta(this.id).subscribe({
            next: (response) => {
                this.ventas = response;

                this.ventas = this.ventas.map(venta => ({
                    ...venta,
                    mostrarDetalles: false
                }));

                // Habilitar solo la primera cuota no pagada de cada venta
                this.ventas.forEach(venta => {
                    let primeraNoPagada = true;
                    venta.detalleVenta.forEach(cuota => {
                        if (!cuota.pagada && primeraNoPagada) {
                            cuota.habilitadaParaPagar = true;
                            primeraNoPagada = false;
                        } else {
                            cuota.habilitadaParaPagar = false;
                        }
                    });
                });
            },
            error: (error) => {
                console.error('Error al obtener ventas:', error);
            },
        });
    }


    pagarCuota(cuota: any) {
        if (!cuota.pagada) {
            cuota.pagada = true;
            cuota.fechaPago = new Date()  // Fecha actual

            // Actualizar la cuota en Firestore
            this.firestoreService.updateDetalleVenta(cuota)
                .then(() => {
                    console.log(`Cuota ${cuota.idCuota} de la venta ${cuota.idVenta} pagada correctamente.`);
                })
                .catch(error => {
                    console.error('Error al actualizar la cuota:', error);
                });
        }
    }

    guardarContacto() {
        // Si no hay id, significa que es un nuevo contacto
        this.generalError = '';

        if (this.selectedLocalidadAdvanced == undefined) {
            this.generalError = 'Debe seleccionar una localidad';
            return;
        }

        if (this.formData.nombre == "") {
            this.generalError = 'Debe ingresar un nombre!';
            return;
        }

        if (this.formData.direccion == "") {
            this.generalError = 'Debe ingresar una dirección!';
            return;
        }

        if (this.formData.telefono == "") {
            this.generalError = 'Debe ingresar un teléfono!';
            return;
        }

        if (this.id === 0 || !this.id) {

            // Guardar un nuevo contacto
            this.firestoreService.contactoId().subscribe(idContacto => {

                const nuevoContacto: DetalleContacto = {
                    ...this.formData,
                    id: idContacto,
                    localidad: Number(this.selectedLocalidadAdvanced.id)
                };
                this.firestoreService.agregarContacto(nuevoContacto)
                    .then(() => {
                        console.log('Nuevo contacto guardado');
                        this.messageText = "Datos Guardados!";
                        this.header = "Nuevo";
                        this.messageDialog = true;
                        this.router.navigate(['/contacto', idContacto]);
                    })
            })

        } else {
            const contactoActualizado: DetalleContacto = {
                ...this.formData,
                localidad: Number(this.selectedLocalidadAdvanced.id)
            };

            this.firestoreService.actualizarContacto(this.formData.id, contactoActualizado)
                .then(() => {
                    this.messageText = "Datos Guardados!";
                    this.header = "Actualizacion";
                    this.messageDialog = true;
                });
        }
    }


    show() {
        this.ref = this.dialogService.open(AccionComponent, {
            closable: false,
            showHeader: false,
            width: '620px',
            height: '650px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            data: {
                titulo: `NUEVA VENTA`,
                idCliente: this.id
            },
        });
        this.popupService.registerPopup({
            type: 'dynamic-dialog',
            instance: this.ref,
        });
        this.ref.onClose.subscribe(() => {
            this.ngOnInit();
        });
    }

    toggleRow(venta: Venta) {
        const id = venta.idVenta.toString();
        if (this.expandedRows[id]) {
            delete this.expandedRows[id];
        } else {
            this.expandedRows[id] = true;
        }
    }

    onRowExpand(event: any) {
        console.log('Row expanded:', event.data);
    }

    onRowCollapse(event: any) {
        console.log('Row collapsed:', event.data);
    }

    isRowExpanded(venta: Venta): boolean {
        return !!this.expandedRows[venta.idVenta];
    }

    aceptarMensaje() {
        this.messageDialog = false;
        this.ref.close();
    }
}
