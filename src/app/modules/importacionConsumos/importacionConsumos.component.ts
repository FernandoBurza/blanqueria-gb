import { Component, ViewChild } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { ImportacionConsumosService } from './services/importacionConsumos.service';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { ImportacionConsumosRequest } from './models/ImportacionConsumosRequest';
import { CombustibleProducto } from './models/CombustibleProducto';
import { CombustibleComercio } from './models/CombustibleComercio';
import { CombustibleFactura } from './models/CombustibleFafctura';
import { CombustibleConsumo } from './models/CombustibleConsumo';
import { CombustibleTarjeta } from './models/CombustibleTarjeta';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Elemento } from './models/Elemento'
import { Configuracion } from './models/Configuracion';
import { CombustibleConfiguracionService } from './services/combustibleConfiguracion.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-importacionConsumos',
  templateUrl: './importacionConsumos.component.html',
  styleUrls: ['./importacionConsumos.component.scss'],
  providers: [DatePipe]
})

export class ImportacionConsumosComponent {  
  consumos: any[] = [];  
  progressBar!: boolean;
  cantidadRegistros: number = 0;
  porcentajeAjuste: number = 0;
  limpiar:boolean = false;
  @ViewChild('dtconsumos') dt!: Table;
  filtro:string = "";
  cols: any[] = [];
  fechPeri!: Date;
  columnsToShow: string[] = ['TARJETA', 'PATENTE', 'FECH. TRANSAC.', 'DOMICILIO','LOCALIDAD','PROVINCIA','PRODUCTO','CANT. LTS.', 'IMPORTE','PRECIO APLIC.','TASA VIAL'];
  columnNames: { [key: string]: string } = {'FECHA': 'FECH. TRANSAC.', 'IDENTIFICACION TARJETA': 'PATENTE', 'LITROS UNIDADES': 'CANT. LTS.', 'IMP TOT YER': 'IMPORTE', 'PRECIO YER': 'PRECIO APLIC.'};
  newColsOrder : string[] = [];
  loading: boolean = false;
  progreso:number=0;
  //CONFIGURACION
  configuracionDialog:boolean = false;
  columnsTotal: Configuracion[] = [];
  columnsExcel: Configuracion[] = [];
  selectedColumns: Configuracion[] = [];
  itemBDOptions: string[] = ['Seleccione','NumeTarj','PateMovi','NumeDocu','FechTran','NombCall', 'NombLoca', 'NombProv', 'NombProd','CantProd', 'ImpoTota', 'PrecApli','ImpoTasaVial','NumeFactComb','Comercio','ImpoTotaOrig'];
  relaciones: Configuracion[] = [];
  //FIN CONFIGURACION
  constructor(public router: Router, private importacionConsumosService: ImportacionConsumosService, private combustibleConfiguracionService: CombustibleConfiguracionService,private datePipe: DatePipe, private primengConfig: PrimeNGConfig, private loadingService: LoadingService) {
    
  }

  ngOnInit()
  {
    this.traerConfiguracion();
  }

  onGlobalFilter(table: Table) {
    table.filterGlobal(this.filtro, 'contains');
  }  

  limpiarConsulta(){
    this.dt.clear();
    this.filtro = "";
  }

  readExcelFile(event: any) {
    console.log("readExcelFile called");
    this.loading = true;
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {        
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Obtener los encabezados de las columnas de todo el excel si tiene tituColuVisu coloca ese, sino nombColu.
        this.cols = this.relaciones.map(relacion => relacion.tituColuVisu ? relacion.tituColuVisu : relacion.nombColu);        

        // Obtener los datos (excluyendo la fila de encabezados)
        this.consumos = this.sheetToJSON(worksheet);   
        
        this.analyzeTransactions();        
      };
  
      reader.onerror = (error) => {       
        this.loading = false; // Iniciar la carga al inicio de la función
        console.error(error);
      };

      reader.onloadend = () => {      
        this.loading = false; 
        this.onGlobalFilter(this.dt);
      }

      reader.readAsArrayBuffer(file);
    
    }  
  }

  private sheetToJSON(sheet: XLSX.WorkSheet): any[] {
    const data: any[] = [];
    const range = XLSX.utils.decode_range(sheet['!ref']!);

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const row: any = {};
      // Agregar la columna 'IMPORTE_ORIG' como copia de 'IMPORTE' esta columna no viene en el excel
      // pero se necesita para cuando se modifican las tarifas para saber cual fue el valor anterior
      row['IMPORTEORIG'] = sheet[XLSX.utils.encode_cell({ r: R, c: this.cols.indexOf('IMPORTE') })]?.v;
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { r: R, c: C };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cellValue = sheet[cellRef]?.v;
        const header = this.cols[C];

        row[header] = cellValue;
      }
      data.push(row);
      this.cantidadRegistros = data.length;
    }

    return data;
  }
  
  // Función para realizar el análisis de transacciones y sacar la fecha de periodo
  private analyzeTransactions() {
    // Crear un diccionario para almacenar la cantidad de transacciones por mes/año
    const transactionsByMonthYear: { [key: string]: number } = {};
  
    // Calcular la cantidad de transacciones para cada mes/año
    this.consumos.forEach((row: any) => {
      const dateValue = row['FECH. TRANSAC']; 
      const formattedDate = moment(dateValue, "DD/MM/YYYY HH:mm:ss").toDate();
      if (dateValue) {
        if (!isNaN(formattedDate.getTime())) { // Verificar si la fecha es válida
          const monthYearKey = `${formattedDate.getMonth() + 1}/${formattedDate.getFullYear()}`;
  
          if (transactionsByMonthYear[monthYearKey]) {
            transactionsByMonthYear[monthYearKey]++;
          } else {
            transactionsByMonthYear[monthYearKey] = 1;
          }
        }
      }
    });
  
    // Encontrar el mes/año con la mayor cantidad de transacciones
    const maxTransactionsMonthYear = Object.keys(transactionsByMonthYear).reduce((a, b) =>
      transactionsByMonthYear[a] > transactionsByMonthYear[b] ? a : b
    );
    
    // Obtener la fecha máxima como objeto Date
    let maxDate: Date | null = null;
    
    if (maxTransactionsMonthYear) {
      const [maxMonth, maxYear] = maxTransactionsMonthYear.split('/');
      // Obtener el primer día del mes
      maxDate = new Date(parseInt(maxYear, 10), parseInt(maxMonth, 10) - 1, 1);
    } else {
      console.error('No hay datos válidos para analizar');
    }
  
    this.fechPeri = maxDate!;
  }

  formatearFecha(): string|null {
    if (this.fechPeri) {
      return this.datePipe.transform(this.fechPeri, 'dd/MM/yyyy');
    }
    return '';
  }

  modificarTarifas() {
    this.consumos = this.consumos.map(row => {
      row['IMPORTE'] = parseFloat((row['IMPORTE'] * (1 + (this.porcentajeAjuste / 100))).toFixed(2)); 
      row['PRECIO APLIC.'] = parseFloat((row['PRECIO APLIC.'] * (1 + (this.porcentajeAjuste / 100))).toFixed(2))
      return row;
    });
  }

  findFieldByRelation(fieldName: string, row: { [key: string]: any }): any {
    const relation = this.relaciones.find(rel => rel.nombColuTabl === fieldName);
    return relation ? (relation.tituColuVisu ? row[relation.tituColuVisu] : row[relation.nombColu]) : undefined;
  }

  grabar(){    
    // Crear nueva lista de datos        
    const datosAGrabar = this.consumos.map((row: { [key: string]: any }) => {
      const tarjeta: CombustibleTarjeta = {
        NumeIden: 0,
        NumeTarj: this.findFieldByRelation('NumeTarj', row),        
        PateMovi: row['TIPO IDENTIFICACION TARJETA'] === 'PATENTE' ? this.findFieldByRelation('PateMovi', row) : '',
        NumeDocu: row['TIPO IDENTIFICACION TARJETA'] === 'DNI' ? this.findFieldByRelation('NumeDocu', row) : 0,
        FechEntr: moment('01/01/2009', "DD/MM/YYYY HH:mm:ss").toDate(),
      };
    
      const producto: CombustibleProducto = {
        NumeProd: 0,
        NombProd: this.findFieldByRelation('NombProd', row),
      };
    
      const comercio: CombustibleComercio = {
        NumeCome: (this.findFieldByRelation('NombCome', row)).toString().split('-')[0].trim(),
        NombCome: (this.findFieldByRelation('NombCome', row)).toString().split('-')[1].trim(),
        NombCall: this.findFieldByRelation('NombCall', row),
        // Puedes agregar lógica similar para NombLoca y NombProv usando relaciones
      };
        
      const factura: CombustibleFactura = {
        NumeFact: 0,        
        FechPeri:  moment(this.fechPeri).format('YYYY-MM-DD'),
        NumeFactComb: this.findFieldByRelation('NumeFactComb', row) === '' ? 111111111111 : this.findFieldByRelation('NumeFactComb', row).replace(/[AF]/g, ''),
        FechCarg: new Date(),
        NumeEsta: 1,
      };
      
    
      // Mapeo de consumo usando relaciones para obtener los nombres de campo correctos
      const consumo: CombustibleConsumo = {
        NumeConsComb: this.findFieldByRelation('NumeConsComb', row),
        NumeIden: this.findFieldByRelation('NumeIden', row),        
        FechTran: moment((this.findFieldByRelation('FechTran', row)), "DD/MM/YYYY HH:mm:ss").toDate(),
        NumeCome: this.findFieldByRelation('NumeCome', row),
        NumeProd: 0,
        CantProd: this.findFieldByRelation('CantProd', row),
        ImpoTota: this.findFieldByRelation('ImpoTota', row),
        NumeFact: 0,
        NumeEsta: 0,
        ImpoTotaOrig: row["IMPORTEORIG"],
        ImpoTasaVial: this.findFieldByRelation('ImpoTasaVial', row),
        // Puedes continuar mapeando otros campos usando relaciones
      };
    
      const newData: ImportacionConsumosRequest = {
        tarjeta: tarjeta,
        producto: producto,
        comercio: comercio,
        factura: factura,
        consumo: consumo,
      };
    
      return newData;
    });
    // Utilizar datosAGrabar en tu lógica de inserción
    this.importacionConsumosService.insertData(datosAGrabar)
      .subscribe(
        () => {
          console.log('Datos grabados exitosamente');
        }
      );
  }

  mostrarConfiguracion(){
    this.configuracionDialog = true;
  } 

  readExcelColumns(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Obtener los encabezados de las columnas
        const headers: Configuracion[] = [];    
        const range = XLSX.utils.decode_range(worksheet['!ref']!);
    
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { r: range.s.r, c: C };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          const headerCellValue = worksheet[cellRef]?.v || `Columna${C + 1}`; 
          const columnObject = { posiColu: C + 1, nombColu: headerCellValue };
          headers.push(columnObject);
        }
        this.columnsTotal = headers; 
        this.columnsExcel = headers;
        // Actualiza el orden target después de cargar columnsTotal
      };
      reader.onerror = (error) => {
        console.error(error);
      };

      reader.readAsArrayBuffer(file);
    }  
  }

  isInTargetList(item: Configuracion): boolean {
    return this.selectedColumns.some(col => col.posiColu === item.posiColu);
   }
 
   startEditing(item: any) {
    item.editing = true;    
   }
  
  confirmEdit(item: any) {
    item.editing = false;
  }
  
  cancelEdit(item: any) {
    // Restablecer el estado de edición
    item.editing = false;
  }

  onMoveToTarget(event: any) {
    event.items.forEach((item: { campoOrden: string | null; campoExcel: any; }) => {
      if (item.campoOrden == null || item.campoOrden == "") {
        item.campoOrden = item.campoExcel;
      }
    });
   }
   
  guardarRelaciones() {
    let combinedArray: Configuracion[] = [];

    this.selectedColumns.forEach((item, index) => {
      item.posiColu = index + 1;
    });
    
    // Combinar columnsTotal y selectedColumns en uno solo
    combinedArray = [...this.columnsExcel, ...this.selectedColumns];
    
    // Mapear a través de combinedArray
    combinedArray = combinedArray.map((item, index) => {
      // Buscar el item correspondiente en columnsExcel
      let columnItem = this.columnsExcel.find(col => col.posiColu === item.posiColu);
    
      // Si encontró un item correspondiente, actualizar sus propiedades
      if (columnItem) {
        columnItem.posiColuVisu = item.posiColuVisu;
        columnItem.nombColuTabl = item.nombColuTabl;
        columnItem.tituColuVisu = item.tituColuVisu;
        return columnItem;
      }
    
      // Si no encontró un item correspondiente, añadir el item a columnsExcel
      else {
        return item;
      }
    });
    // Ahora puedes grabar combinedArray como desees
    console.log(combinedArray);
  }

  //EN EL CASO DE TERMINAR CON LA CONFIGURACION TRAER LOS DATOS Y MOSTRARLOS PARA MODIFICAR
  traerConfiguracion() {       
    this.combustibleConfiguracionService.getData().subscribe(
      (configuracion: Configuracion[]) => {
        this.relaciones = configuracion;
          this.newColsOrder = configuracion
              .filter(conf => conf.tituColuVisu && conf.tituColuVisu !== null && conf.posiColuVisu !== undefined)
              .sort((a, b) => a.posiColuVisu! - b.posiColuVisu!)
              .map(conf => conf.tituColuVisu)
              .filter(title => title !== undefined) as string[];
            
      });   
  }

  cancelarConfiguracion(){}

}
