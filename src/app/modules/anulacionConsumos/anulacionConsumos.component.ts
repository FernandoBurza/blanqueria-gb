import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AnulacionConsumosService } from './services/anulacionConsumos.service';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AnulacionConsumosRequest } from './models/anulacionConsumosRequest';
import { ConsumosResponse } from '../administracionTarjetas/models/consumosResponse';
import { DropDownList } from './models/dropDownList';
import { MessageResponse } from './models/messageResponse';


@Component({
  selector: 'app-anulacionConsumos',
  templateUrl: './anulacionConsumos.component.html',
  styleUrls: ['./anulacionConsumos.component.scss']
})
export class AnulacionConsumosComponent {
    progressBar!: boolean;
    anulacionConsumosRequest: AnulacionConsumosRequest = {};
    consumosResponse: ConsumosResponse = {};
    anularDialog: boolean = false;
    listaPrestadores: DropDownList[] = [];
    filteredPrestadores: DropDownList[] = [];
    selectedPrestadoresAdvanced!: DropDownList | undefined;
    selectedPrestador!: number | undefined;
    prestadorError:string="";  
    fechPeri = "";
    fechPeriError:string="";
    impoTota = 0;
    messageDialog: boolean = false;
    messageText: string = "";
    otraCuenta: boolean = false;
    habilitarOtraCuenta: boolean = false
    listaOtras: DropDownList[] = [];
    filteredOtras: DropDownList[] = [];
    selectedOtrasAdvanced!: DropDownList | undefined;
    selectedOtra!: number | undefined;
    otraError:string="";  

    constructor(public router: Router, private anulacionConsumosService: AnulacionConsumosService, private primengConfig: PrimeNGConfig, private loadingService: LoadingService, public dialogService: DialogService,private route: ActivatedRoute) { }    

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }  
        
    ngOnInit(){        
        this.loadingService.loading$.subscribe(loading => this.progressBar = loading);             
        this.anulacionConsumosService.getPrestadores()
        .subscribe((listaPrestadores: DropDownList[]) => {
            this.listaPrestadores = listaPrestadores;  
            this.listaOtras = listaPrestadores;           
          });
    }

    filterPrestador(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.listaPrestadores.length; i++) {
            const prestador = this.listaPrestadores[i];
            if (prestador.value && prestador.value.toLowerCase().includes(query.toLowerCase())) {
                filtered.push(prestador);
            }
        }
    
        this.filteredPrestadores = filtered;
    }

    filterOtra(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.listaOtras.length; i++) {
            const otra = this.listaOtras[i];
            if (otra.value && otra.value.toLowerCase().includes(query.toLowerCase())) {
                filtered.push(otra);
            }
        }
    
        this.filteredOtras = filtered;
    }

    onPrestadorSelected(event: any) {
        this.selectedPrestador = event.value; 
        this.prestadorError = "";           
    }

    onOtraSelected(event: any) {
        this.selectedOtra = event.value;  
        this.otraError = "";          
    }

    limpiarError()
    {
        this.fechPeriError = "";
    }
    
    traerConsumoAnular() { 
        if (!this.validarCampos())
        {
            this.impoTota = 0;
            return;
        }
        this.loadingService.loading$.subscribe(loading => this.progressBar = loading);
        this.anulacionConsumosRequest.numePres = parseInt(this.selectedPrestadoresAdvanced!.key!);
        this.anulacionConsumosRequest.fechPeri = this.fechPeri;        
        this.anulacionConsumosService.getData(this.anulacionConsumosRequest).subscribe(
            (consumo: number) => {
                this.impoTota = consumo;
            } );            
    }
        
    anular()
    {             
        if (this.selectedOtra != undefined)
            this.anulacionConsumosRequest.numePresOtr = parseInt(this.selectedOtrasAdvanced!.key!);

        this.anulacionConsumosRequest.impoTota = this.impoTota;
        
        this.anulacionConsumosService.cancelConsumption(this.anulacionConsumosRequest)
        .subscribe(
            (response: MessageResponse) => {
                this.anularDialog = false;
                this.messageDialog = true;  
                if (response.retorno == 1)                
                    this.messageText = response.mensaje;
                else
                    this.messageText = "Ocurrió un error al cambiar el estado del consumo!"               
                
              }
        ); 
    }

    validarCampos(){
        if (this.selectedPrestador == undefined && !this.otraCuenta){
            this.prestadorError = "Debe seleccionar un prestador.";
            this.impoTota = 0;
            return false;
        } 

        if (this.selectedOtra == undefined && this.otraCuenta){
            this.otraError = "Debe seleccionar la cuenta a imputar la NC.";
            return false;
        }

        if (this.fechPeri == "__/____" || this.fechPeri == ""){
            this.fechPeriError = "Debe seleccionar una fecha.";
            this.impoTota = 0;
            return false;
        }
        return true; 
    }
    
    mostrarDialog()
    {
        if (this.validarCampos())
            this.anularDialog = true;    
    }

    aceptar()
    {
        this.anularDialog = false;
        this.anular();       
    }    
    
    cancelar(){
        this.anularDialog = false; 
    }

    aceptarMessage()
    {
        this.messageDialog = false;
        this.limpiarConsulta();
    }  

    limpiarConsulta(){
        this.selectedPrestadoresAdvanced = undefined; 
        this.selectedPrestador = undefined;
    }

}
