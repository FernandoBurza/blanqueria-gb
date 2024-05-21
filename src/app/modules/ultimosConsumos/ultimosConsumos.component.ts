import { Component, ElementRef, ViewChild } from '@angular/core';
import { CombustibleConsumo } from './models/combustibleConsumo';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UltimosConsumosService } from './services/ultimosConsumos.service';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import * as ExcelJS from 'exceljs';
import { TarjetaHistorico } from '../administracionTarjetas/models/tarjetaHistorico';
import { AdministracionTarjeta } from '../administracionTarjetas/models/administracionTarjeta';
import { AdministracionTarjetasService } from '../administracionTarjetas/services/administracionTarjetas.service';


@Component({
  selector: 'app-ultimosConsumos',
  templateUrl: './ultimosConsumos.component.html',
  styleUrls: ['./ultimosConsumos.component.scss']
})
export class UltimosConsumosComponent {
    tarjetas: CombustibleConsumo[] = [];
    @ViewChild('filter') filter!: ElementRef;
    numeroTarjeta: string = "";
    mostrarListado: boolean = true;
    mostrarAcciones: boolean = false;
    seleccionada: boolean = false;
    habilitarEntrega: boolean = true;
    mostrarPaso: number = 0;   
    comsumoSeleccionado: CombustibleConsumo = {};
    consumo: CombustibleConsumo = {};
    searchText: string = "";    
    mantenerDatos: boolean = false;
    progressBar!: boolean;
    activasCheck: boolean = true;
    inactivasCheck: boolean = false;
    ref: DynamicDialogRef | undefined;
    @ViewChild('dtTarjetas') table!: Table;
    entregarDialog: boolean = false;
    fechaEntrega = new Date().toISOString().split('T')[0];
    tarjetaHistorico: TarjetaHistorico[] = [];
    tarjetaSeleccionada: AdministracionTarjeta = {};

    constructor(public router: Router, private ultimosConsumosService: UltimosConsumosService, private primengConfig: PrimeNGConfig, private loadingService: LoadingService, public dialogService: DialogService, private administracionTarjetasService: AdministracionTarjetasService) { }    

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }                 

    ngOnInit(){
        this.loadingService.loading$.subscribe(loading => this.progressBar = loading);        
        this.traerUltimosConsumos();
    }

    traerUltimosConsumos() {
        this.ultimosConsumosService.getData().subscribe(
            (tarjetas: CombustibleConsumo[]) => {
                this.tarjetas = tarjetas;            
                //this.onStatusFilter(this.table);     
            } );            
    }

    traerHistorico(numeTarj : string) {
        this.administracionTarjetasService.getHistoricalData(numeTarj).subscribe(
            (tarjetaHistorico: TarjetaHistorico[]) => {
               this.tarjetaHistorico =  tarjetaHistorico;
            } );
    }

    onRowSelect(event:{data: CombustibleConsumo;}) {   
        this.numeroTarjeta = event.data.numeTarj!;
        this.seleccionada =true;
        this.traerHistorico(this.numeroTarjeta);        
    }   
    
    verDetalle(tarjeta: AdministracionTarjeta){       
            this.router.navigate(['/administracionTarjetas'], { queryParams: { numeTarjParam: tarjeta.numeTarj } });
    } 

    exportToExcel(): void {
        let headers = ['Tarjeta', 'Sociedad', 'Patente/Doc', 'Fecha Entrega', 'Fecha Ult Consumo', 'Dias sin Consumo'];
        let data = this.tarjetas.map(tarjeta => {
            return [tarjeta.numeTarj, tarjeta.sociedad, tarjeta.pateDocu, moment(tarjeta.fechEntr).format('DD/MM/YYYY'), moment(tarjeta.ultimoConsumo).format('DD/MM/YYYY'), tarjeta.diasSinConsumo];
        });
        
        // Crea un nuevo libro de trabajo
        let workbook = new ExcelJS.Workbook();
     
        // Agrega una hoja de trabajo al libro de trabajo
        let worksheet = workbook.addWorksheet('Sheet1');
     
        // Agrega los encabezados al inicio de la matriz de datos
        data.unshift(headers);
     
        // Agrega los datos a la hoja de trabajo
        data.forEach((row, index) => {
            row.forEach((cell, cellIndex) => {
                let cellRef = worksheet.getCell(index + 1, cellIndex + 1);
                cellRef.value = cell;
     
                // Si es una celda de encabezado, establece su color de fondo
                if (index === 0) {
                    cellRef.fill = {
                       type: 'pattern',
                       pattern: 'solid',
                       fgColor: { argb: '0c475b' } // color de la celda
                    };
                    cellRef.font = {
                        color: { argb: 'FFFFFF' } // color de la fuente
                      };
                }
            });
        });
     
        // Escribe el libro de trabajo a un buffer
        workbook.xlsx.writeBuffer().then(data => {
            let blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            FileSaver.saveAs(blob, 'ultimosConsumos.xlsx');
        });
       }
       
    s2ab(s:any) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
       }
       
}
