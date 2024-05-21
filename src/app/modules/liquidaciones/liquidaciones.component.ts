import { Component, ElementRef, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Table } from 'primeng/table';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import * as ExcelJS from 'exceljs';
import { LiquidacionesService } from './services/liquidaciones.service';
import { Liquidacion } from './models/liquidacion';
interface expandedRows {
    [key: string]: boolean;
}
@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.scss']
})
export class LiquidacionesComponent {
    
    tarjetas: Liquidacion[] = [];
    @ViewChild('filter') filter!: ElementRef;
    seleccionada: boolean = false;
    liquidacionSeleccionada: Liquidacion = {};
    liquidacion: Liquidacion = {};
    progressBar!: boolean;
    ref: DynamicDialogRef | undefined;
    @ViewChild('dtTarjetas') table!: Table;
    fechPeri = new Date().toISOString().split('T')[0];
    cols!: any[];
    expandedRows: expandedRows = {};
    activityValues: number[] = [0, 100];
    selectedSociedad: string[] = [];
    

    isExpanded: boolean = false;
    constructor(public router: Router, private liquidacionesService: LiquidacionesService, private primengConfig: PrimeNGConfig, private loadingService: LoadingService,) {         
        this.fechPeri = "2020-12-01";
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }                 

    ngOnInit(){
      this.loadingService.loading$.subscribe(loading => this.progressBar = loading);           
    
      this.traerLiquidaciones();
    }

    expandAll() {
        if (!this.isExpanded) {
            this.tarjetas.forEach(tarjeta => tarjeta && tarjeta.id ? this.expandedRows[tarjeta.id] = true : '');

        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    traerLiquidaciones() {
        this.liquidacionesService.getData(this.fechPeri).subscribe(
            (tarjetas: Liquidacion[]) => {
                this.tarjetas = tarjetas;            
                //this.onStatusFilter(this.table);     
            } );            
    }

    selectSociedad(society: string) {
        // Obtener las tarjetas de la sociedad seleccionada
        const selectedTarjetas = this.tarjetas.filter(tarjeta => tarjeta.sociedad === society);
    
        // Verificar si la sociedad ya está seleccionada
        const isAlreadySelected = this.selectedSociedad.includes(society);
    
        // Limpiar las filas expandidas antes de seleccionar una nueva sociedad
        this.expandedRows = {};
    
        if (!isAlreadySelected || (isAlreadySelected && !this.isExpanded)) {
            // Si la sociedad no estaba seleccionada o estaba colapsada, expandir las filas
            selectedTarjetas.forEach(tarjeta => {
                if (tarjeta.id) {
                    this.expandedRows[tarjeta.id] = true;
                }
            });
    
            // Actualizar el arreglo de sociedades seleccionadas
            this.selectedSociedad = [society];
    
            // Actualizar el estado de expansión
            this.isExpanded = true;
        } else {
            // Si la sociedad ya estaba seleccionada y expandida, colapsar las filas
            // Limpiar el arreglo de sociedades seleccionadas
            this.selectedSociedad = [];
    
            // Actualizar el estado de expansión
            this.isExpanded = false;
        }
    }
    
    calculateTotalBySocieties(societies: string[]) {
        let total = 0;
        societies.forEach(society => {
            this.tarjetas.forEach(tarjeta => {
            if (tarjeta.sociedad === society) {
                total += tarjeta.detalles![0].impoTota!;
            }
            });
        });
        return total;
    }
    
    exportToExcel(): void {
      let headers = ['Cta', 'Sociedad', 'Rubro', 'Actividad', 'Fecha Transac', 'Patente', 'Vehiculo', 'DNI', 'Producto', 'Cant. Lts.', 'p. Unitario', 'Tasa Vial', 'Total c/Imp.', 'Establecimiento', 'Domicilio', 'Localidad', 'Provincia', 'N° Tarjeta'];
      let data = this.tarjetas.map(tarjeta => {
        return [tarjeta.numePres, tarjeta.sociedad, tarjeta.numePres ? 'Prestador' : 'Otro', tarjeta.nombActi, moment(tarjeta.detalles![0].fechTran).format('DD/MM/YYYY'), tarjeta.detalles![0].pateMovi, tarjeta.detalles![0].nombMovi, tarjeta.detalles![0].numeDocu, tarjeta.detalles![0].nombProd, tarjeta.detalles![0].cantProd, tarjeta.detalles![0].impoUnit, tarjeta.detalles![0].tasaVial, tarjeta.detalles![0].impoTota, tarjeta.detalles![0].nombCome, tarjeta.detalles![0].nombCall, tarjeta.detalles![0].nombLoca, tarjeta.detalles![0].nombProv, tarjeta.detalles![0].numeTarj];
      });
    
      // Crea un nuevo libro de trabajo
      let workbook = new ExcelJS.Workbook();
    
      // Agrupa los datos por 'tarjeta.nombActi'
      let groupedData = this.groupBy<any[]>(data.slice(1), row => row[3]);
       // Agrupa por el índice 3 (Actividad)
    
      // Agrega las hojas de trabajo al libro
      Object.keys(groupedData).forEach((actividad, index) => {
        let worksheet = workbook.addWorksheet(index === 0 ? 'SIN ACTIVIDAD' : actividad);
    
        // Agrega los encabezados a la hoja de trabajo
        worksheet.addRow(headers);
    
        // Agrega los datos a la hoja de trabajo
        groupedData[actividad].forEach((row) => {
          worksheet.addRow(row);
        });
        
        // Ajusta automáticamente el ancho de las columnas
        worksheet.columns.forEach((column, columnIndex) => {
            let maxLength = 0;
          
            // Itera sobre todas las filas para encontrar el valor más largo en la columna
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
              const cellValue = row.getCell(columnIndex + 1)?.value;
              const cellText = cellValue !== null && cellValue !== undefined ? cellValue.toString() : '';
              maxLength = Math.max(maxLength, cellText.length);
            });
          
            // Establece el ancho de la columna basándose en el valor máximo encontrado
            column.width = maxLength + 2; // Agrega un pequeño margen
          });
      });
    
      // Escribe el libro de trabajo a un buffer
      workbook.xlsx.writeBuffer().then(data => {
        let blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        FileSaver.saveAs(blob, 'liquidaciones.xlsx');
      });
    }
    
    // Función auxiliar para agrupar por una propiedad específica
    groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
        return arr.reduce((acc, curr) => {
          const keyValue = key(curr);
          (acc[keyValue] = acc[keyValue] || []).push(curr);
          return acc;
        }, {} as Record<string, T[]>);
      }
    
    s2ab(s:any) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
       }
}
