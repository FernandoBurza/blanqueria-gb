import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AdministracionTarjeta } from './models/administracionTarjeta';
import { TarjetaHistorico } from './models/tarjetaHistorico';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AdministracionTarjetasService } from './services/administracionTarjetas.service';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccionComponent } from './components/accion/accion.component';
import { CombustibleTarjeta } from './models/combustibleTarjeta';
import { ConsumosResponse } from './models/consumosResponse';
import { ConsumosRequest } from './models/consumosRequest';
import { MessageResponse } from './models/messageResponse';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-administracionTarjetas',
  templateUrl: './administracionTarjetas.component.html',
  styleUrls: ['./administracionTarjetas.component.scss'],
  providers: [DatePipe]
})
export class AdministracionTarjetasComponent {
    tarjetas: AdministracionTarjeta[] = [];
    tarjetaHistorico: TarjetaHistorico[] = [];
    @ViewChild('filter') filter!: ElementRef;
    numeroTarjeta: string = "";    
    steps: MenuItem[] = [];
    activeStepIndex = 0;
    mostrarListado: boolean = true;
    mostrarAcciones: boolean = false;
    seleccionada: boolean = false;
    habilitarEntrega!: boolean;
    mostrarPaso: number = 0;   
    tarjetaSeleccionada: AdministracionTarjeta = {};
    tarjeta: CombustibleTarjeta = {};
    searchText: string = "";    
    mantenerDatos: boolean = false;
    progressBar!: boolean;
    activasCheck: boolean = true;
    inactivasCheck: boolean = false;
    ref: DynamicDialogRef | undefined;
    @ViewChild('dtTarjetas') table!: Table;
    entregarDialog: boolean = false;
    recibirDialog: boolean = false;
    fechaEntrega = new Date().toISOString().split('T')[0];
    fechaDevolucion = new Date().toISOString().split('T')[0];
    periodo : Date = new Date(0);
    consumosRequest: ConsumosRequest = {};
    confirmDialog: boolean = false;
    consumosResponse: ConsumosResponse = {};
    messageDialog: boolean = false;
    messageText: string = "";
    mostrarCancelar: boolean = false;
    bajaDialog: boolean = false;
    aceptarBajaDialog: boolean = false;
    accion: string ="";
    transferirDialog:boolean = false;
    fechaTransferencia = new Date().toISOString().split('T')[0];
    selectedRow: any;          
    filtro!:string;
    observacion!:string;

    constructor(public router: Router, private administracionTarjetasService: AdministracionTarjetasService, private primengConfig: PrimeNGConfig, private loadingService: LoadingService, public dialogService: DialogService,private route: ActivatedRoute,private datePipe: DatePipe) { }    

    ngOnInit() {
        this.loadingService.loading$.subscribe(loading => this.progressBar = loading);
        this.traerTarjetas();
    }

    onGlobalFilter(table: Table) {
        this.deseleccionarTarjetas();
        table.filterGlobal(this.filtro, 'contains');
      }  
       
    show(accion :string, tarjeta?: CombustibleTarjeta) {        
        if (accion == "Nueva"){
            this.ref = this.dialogService.open(AccionComponent, 
            {   closable: false,   
                showHeader: false,             
                width: '630px',
                height: '500px',                
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000, 
                data: {    
                    titulo: 'NUEVA TARJETA',                 
                    accion: accion
                }                
            }); 
            this.ref.onClose.subscribe((numeTarj: string) => {
                if (numeTarj!="")    
                    this.traerTarjetas(numeTarj);                     
            });
        } 
        else if(accion == "Modificar")   
        {
            this.ref = this.dialogService.open(AccionComponent, 
            {   closable: false,   
                showHeader: false,             
                width: '630px',
                height: '500px',              
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000, 
                data: {    
                    titulo: 'MODIFICAR TARJETA',                 
                    accion: accion,
                    tarjetaModificar: this.tarjetaSeleccionada
                }                     
            });   
            this.ref.onClose.subscribe((result: boolean) => {
                if (result)    
                    this.traerTarjetas(this.tarjetaSeleccionada.numeTarj);                     
                else
                    this.traerTarjetas();
                 
            });
        }
        else if(accion == "Clonar")   
        {
            this.ref = this.dialogService.open(AccionComponent, 
            {   closable: false,   
                showHeader: false,             
                width: '630px',
                height: '500px',              
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000, 
                data: {    
                    titulo: 'COPIAR DATOS',                 
                    accion: "Clonar",
                    tarjetaModificar:this.tarjetaClonar(tarjeta!)
                }                     
            });               
            this.ref.onClose.subscribe((numeTarj: string) => {
                if (numeTarj!="")    
                    this.traerTarjetas(numeTarj);                     
            });
        }
        //SOLO APARECE EL FORMULARIO SI TIENE QUE SELECCIONAR ALGUNA SOCIEDAD
        else if(accion == "Entregar")   
        {
            if(this.tarjetaSeleccionada.numePers == null && this.tarjetaSeleccionada.numePres == null)
            {
                this.ref = this.dialogService.open(AccionComponent, 
                {   closable: false,   
                    showHeader: false,             
                    width: '630px',
                    height: '500px',              
                    contentStyle: { overflow: 'auto' },
                    baseZIndex: 10000, 
                    data: {    
                        titulo: 'ENTREGAR TARJETA',                 
                        accion: accion,
                        tarjetaModificar: this.tarjetaSeleccionada
                    }                                         
                });   
                this.ref.onClose.subscribe((result: boolean) => {
                    if (result)    
                    {
                        this.habilitarEntrega = false;
                        this.consumos();                   
                    }
                    /*else
                        this.traerTarjetas();*/
                });
            }
            else{
                this.entregarDialog = true;
            }
        }
        else if(accion == "Recibir")   
        {
            this.recibirDialog = true;
        }
        else if(accion == "Baja")   
        {
            this.bajaDialog = true;
        }
    }
    
    onStatusFilter(table: Table) {
        this.deseleccionarTarjetas();
        let filterValue = '';
        if (this.activasCheck && !this.inactivasCheck) {
            filterValue = 'Activa';
        } else if (!this.activasCheck && this.inactivasCheck) {
            filterValue = 'Inactiva';
        }
        table.filter(filterValue, 'estado', 'equals');                
    }      

    traerTarjetas(numeTarj?: string) {       
        this.administracionTarjetasService.getData().subscribe(
            (tarjetas: AdministracionTarjeta[]) => {
                this.tarjetas = tarjetas;       
                //Si vengo de la pagina de Ultimos Consumos, busco la tarjeta que viene por parametro
                //la filtro, y muestro su detalle
                this.route.queryParams.subscribe(params => {
                    let numeTarjParam = params['numeTarjParam'];         
                    if (numeTarjParam)
                    {           
                        this.filtrarYSeleccionarTarjeta(numeTarjParam, tarjetas);
                    }
                });     
                this.onStatusFilter(this.table);
                if (numeTarj)
                    this.filtrarYSeleccionarTarjeta(numeTarj, tarjetas);                     
            } );            
    }

    filtrarYSeleccionarTarjeta(numeTarjParam : string, tarjetas: AdministracionTarjeta[]){
        this.table.filterGlobal(numeTarjParam, 'contains');
                        this.seleccionada = true;
                        this.selectedRow = tarjetas.find(tarjeta => tarjeta.numeTarj === numeTarjParam);                        
                        this.traerHistorico(numeTarjParam);
                        this.observacion =  this.selectedRow.descTarj!; 
                        this.tarjetaSeleccionada = this.selectedRow;
    }
    limpiarConsulta(){
        this.table.clear();
        this.filtro = "";
        this.onStatusFilter(this.table);
        this.deseleccionarTarjetas();
      }

      deseleccionarTarjetas() {
        this.selectedRow = null; //Con esto deselecciono las filas
        this.tarjetaHistorico = []; //Con esto borro el historial de abajo
        this.seleccionada = false; //Con esto logro reestablecer los botones
    }

    onRowSelect(event:{data: AdministracionTarjeta;}) {
        this.seleccionada = true;
        this.habilitarEntrega = event.data.fechEntr === "";
        this.tarjetaSeleccionada = event.data;
        this.numeroTarjeta = event.data.numeTarj!;
        this.observacion = event.data.descTarj!;
        this.traerHistorico(event.data.numeTarj!);        
    }
    
    traerHistorico(numeTarj : string) {
        this.administracionTarjetasService.getHistoricalData(numeTarj).subscribe(
            (tarjetaHistorico: TarjetaHistorico[]) => {
               this.tarjetaHistorico =  tarjetaHistorico;               
            } );
    }

    baja()
    {
        this.administracionTarjetasService.Disable(this.tarjetaSeleccionada.numeIden!)
        .subscribe(
            (response: MessageResponse) => {
                this.bajaDialog = false;
                this.aceptarBajaDialog = true;                
                this.messageText = response.mensaje;
                this.traerTarjetas();
            }              
        ); 
    }

    aceptarBaja(){
        this.aceptarBajaDialog = false;
    }

    entregar()
    {
        this.accion = "entregar";
        this.tarjeta.numeIden = this.tarjetaSeleccionada.numeIden!;
        this.tarjeta.fechEntr = this.fechaEntrega;
        
        this.administracionTarjetasService.Deliver(this.tarjeta)
        .subscribe(
            (response: MessageResponse) => {
                this.entregarDialog = false;
                if (response.retorno != 1)//si da error muestro mensaje
                {
                    this.messageDialog = true;                
                    this.messageText = response.mensaje;
                    this.habilitarEntrega = true;
                }
                else //sino traspaso consumos
                {
                    this.consumos();
                    this.habilitarEntrega = false;
                }
              }              
        ); 
    }

    recibir()
    {
        this.accion = "recibir";
        this.tarjeta.numeIden = this.tarjetaSeleccionada.numeIden!;
        this.tarjeta.fechDevo = this.fechaDevolucion;
        
        this.administracionTarjetasService.Receive(this.tarjeta)
        .subscribe(
            (response: MessageResponse) => {                
                this.recibirDialog= false;                    
                this.messageDialog = true;
                this.messageText = response.mensaje;   
                if (response.retorno == 1)//si es ok
                    this.habilitarEntrega = true;  
                else
                    this.habilitarEntrega = false;
            } );
    }

    consumos()
    {
        //Oper = 1 Es para que se consulten si existen consumos pendientes
        this.consumosRequest.oper = 1;
        this.consumosRequest.numeIden = this.tarjetaSeleccionada.numeIden!;
        this.consumosRequest.fechPeri = new Date(0).toDateString();
        
        this.administracionTarjetasService.Consumption(this.consumosRequest)
        .subscribe(
            (response: ConsumosResponse) => {
                this.consumosResponse = response;
                if (this.consumosResponse.resultado == 1)
                    this.confirmDialog = true;
                else
                {
                    this.messageDialog = true;
                    this.messageText = "No se han encontrado consumos anteriores pendientes.";
                }
            } );            
    }

    confirmaTransferencia()
    {
        this.confirmDialog = false;
        this.transferirDialog = true;        
    }

    transferir()
    {
        //Oper = 2 Confirma transferencia de consumos y se los pasa al prestador.
        this.consumosRequest.oper = 2;
        this.consumosRequest.numeIden = this.tarjetaSeleccionada.numeIden!;
        this.consumosRequest.fechPeri = this.fechaTransferencia;
                
        this.administracionTarjetasService.Consumption(this.consumosRequest)
        .subscribe(
            (response: ConsumosResponse) => {
                if (response.resultado == 2)    
                {
                    this.confirmDialog = false;     
                    this.transferirDialog = false;               
                    this.messageDialog = true; 
                    this.messageText = "Se han trasnferido correctamente los consumos anteriores.";                                                             
                }
                else
                {
                    this.messageDialog = true; 
                    this.transferirDialog = false; 
                    this.messageText = "No se han trasnferido los consumos anteriores.";                                                              
                }
            } ); 
    }

    formatearFecha(dateString :string ){        
        const dateParts = dateString.split(/[\/\s\:]/g);
        
        // Convertir las partes de la cadena a números
        const year = parseInt(dateParts[2], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Los meses en JavaScript comienzan desde 0
        const day = parseInt(dateParts[0], 10);
        const hour = parseInt(dateParts[3], 10);
        const minute = parseInt(dateParts[4], 10);
        const second = parseInt(dateParts[5], 10);
        
        // Crear el objeto Date con los valores numéricos
        const date = new Date(year, month, day, hour, minute, second);
        
        // Formatear la fecha al formato 'yyyy-MM-dd'
        const formattedDate = date.getFullYear() + '-' +
         ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
         ('0' + date.getDate()).slice(-2);
         return formattedDate;
    }

    tarjetaClonar(tarjeta: CombustibleTarjeta) {
        //Clonado de tarjeta al recibir
        this.accion = "clonar"; 
        if (JSON.stringify(tarjeta) === '{}') 
        {
            if (this.tarjetaSeleccionada.pateMovi != null)
            {
                this.tarjeta.pateMovi = this.tarjetaSeleccionada.pateMovi;
                this.tarjeta.numeDocu = null;
                this.tarjeta.numeMovi = this.tarjetaSeleccionada.numeMovi;
                this.tarjeta.modeMovi = this.tarjetaSeleccionada.modeMovi;
                this.tarjeta.cantLitrTanq = this.tarjetaSeleccionada.cantLitrTanq;
            }
            else
            {
                this.tarjeta.pateMovi = null;
                this.tarjeta.numeDocu = this.tarjetaSeleccionada.numeDocu;
                this.tarjeta.numeMovi = null;
                this.tarjeta.modeMovi = null;
                this.tarjeta.cantLitrTanq = null;
            }
            this.tarjeta.numeIden = this.tarjetaSeleccionada.numeIden;
            this.tarjeta.numeTarj = this.tarjetaSeleccionada.numeTarj;
            this.tarjeta.nombMovi = this.tarjetaSeleccionada.nombMovi;
            this.tarjeta.numePres = null;
            this.tarjeta.numePers = null;
            this.tarjeta.obseProdPerm = this.tarjetaSeleccionada.obseProdPerm;
            this.tarjeta.fechEntr = null;
            this.tarjeta.fechDevo = null;
            this.tarjeta.numeEsta = this.tarjetaSeleccionada.numeEsta;
            this.tarjeta.numePinn = this.tarjetaSeleccionada.numePinn;
            this.tarjeta.numeImpoTopeTran = this.tarjetaSeleccionada.numeImpoTopeTran;
            this.tarjeta.numeImpoTopeMens = this.tarjetaSeleccionada.numeImpoTopeMens;
            this.tarjeta.descTarj = this.tarjetaSeleccionada.descTarj;       
        } 
        else
        {
            this.tarjeta.numeIden = tarjeta.numeIden;
            this.tarjeta.numeTarj = tarjeta.numeTarj;
            this.tarjeta.numeMovi = tarjeta.numeMovi;
            this.tarjeta.nombMovi = tarjeta.nombMovi;
            this.tarjeta.modeMovi = tarjeta.modeMovi;
            this.tarjeta.pateMovi = tarjeta.pateMovi;
            this.tarjeta.numePres = tarjeta.numePres;
            this.tarjeta.numePers = tarjeta.numePers;
            this.tarjeta.numeDocu = tarjeta.numeDocu;
            this.tarjeta.cantLitrTanq = tarjeta.cantLitrTanq;
            this.tarjeta.obseProdPerm = tarjeta.obseProdPerm;
            this.tarjeta.fechEntr = tarjeta.fechEntr == ""? null: this.formatearFecha(tarjeta.fechEntr!);
            this.tarjeta.fechDevo = tarjeta.fechDevo == ""? null: this.formatearFecha(tarjeta.fechDevo!);
            this.tarjeta.numeEsta = tarjeta.numeEsta;
            this.tarjeta.numePinn = tarjeta.numePinn;
            this.tarjeta.numeImpoTopeTran = tarjeta.numeImpoTopeTran;
            this.tarjeta.numeImpoTopeMens = tarjeta.numeImpoTopeMens;
            this.tarjeta.descTarj = tarjeta.descTarj;  
              
        }          
        return this.tarjeta;
      }

      clonar(tarjeta: CombustibleTarjeta){               
        this.administracionTarjetasService.Clone(this.tarjetaClonar(tarjeta))
        .subscribe(
            (response: MessageResponse) => {                
                this.messageDialog = true;
                this.messageText = response.mensaje; 
                this.filtrarYSeleccionarTarjeta(tarjeta.numeTarj!, this.tarjetas);                                
            } );
      }
    

    aceptar(accion: string)
    {
        if (accion == "recibir")
        {
            this.messageDialog = false;
            this.bajaDialog = true;
        }        
        else if (accion == "baja")
        {
            this.messageDialog = false;
            this.baja();
            if (this.accion == "recibir")
                this.tarjetaClonar({});
        }
        else
        {
            this.messageDialog = false;
            this.traerTarjetas(this.tarjetaSeleccionada.numeTarj);            
        }

    }
    
    cancelar(accion : string){
        switch (accion) {
            case "entregar":
                this.entregarDialog = false;
                break;
            case "recibir":
                this.recibirDialog = false;
                break;
            case "baja":
                this.bajaDialog = false;
                //this.clonar({}); //no clonar al dar de baja la tarjeta
                break;
            case "transferencia":
                this.confirmDialog= false; 
                break;
            case "transferir":
                this.transferirDialog = false;
                break;
            default:
                break;
        }        
    }

}
