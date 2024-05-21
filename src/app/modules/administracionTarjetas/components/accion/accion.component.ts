import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DropDownService } from 'src/app/shared/services/dropDown.service';
import { DropDownList } from 'src/app/Interfaces/dropDownList';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AdministracionTarjetasService } from '../../services/administracionTarjetas.service';
import { CombustibleTarjeta } from '../../models/combustibleTarjeta';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageResponse } from '../../models/messageResponse';
import { Observable, map } from 'rxjs';

@Component({
  selector:'accion',
    templateUrl: './accion.component.html',
    styleUrls: ['./accion.component.scss']
})

export class AccionComponent{    
  accion!: string;
  titulo!: string;
  tarjetaModificar!: CombustibleTarjeta; 
  numeroTarjeta!: string;   
  marcayDescripcion!: string;
  patente!: string;
  documento!: string;
  listaPrestadores: DropDownList[] = [];
  listaPersonas: DropDownList[] = [];
  filteredPrestadores: DropDownList[] = [];
  selectedPrestadoresAdvanced!: DropDownList;
  filteredPersona: DropDownList[] = [];
  selectedPersonaAdvanced!: DropDownList;
  selectedTipoCuenta!: number;
  selectedPrestador!: number;
  selectedPersona!: number;
  numeroTarjetaError:string="";
  prestadorError:string="";  
  personaError:string="";  
  patenteError:string="";
  loading!: boolean;
  tarjeta: CombustibleTarjeta = {};
  valRadio: string = 'Prestador';
  observacion:string="";
  entregarDialog: boolean = false;
  messageDialog: boolean = false;
  messageText: string ="";
  fechaEntrega = new Date().toISOString().split('T')[0];
  generalError:string="";
  header:string="";
  confirmarDialog:boolean =false;
  aplicarDialog:boolean =false;
  deshabilitarDocumento:boolean=false;
  deshabilitarMovil:boolean=false;

  constructor(public router: Router, private dropDownService: DropDownService, private administracionTarjetasService: AdministracionTarjetasService, public ref: DynamicDialogRef, @Inject(DynamicDialogConfig) public config: DynamicDialogConfig) { }
  
  ngOnInit(){
    this.titulo =  this.config.data.titulo;
    this.accion =  this.config.data.accion;
    this.tarjetaModificar = this.config.data.tarjetaModificar;
    
    //si viene de redirigir mantengo datos
    this.dropDownService.get('prestador', undefined)
    .subscribe((listaPrestadores: DropDownList[]) => {
        this.listaPrestadores = listaPrestadores; 
        if (this.accion == "Modificar" || this.accion == "Clonar" ) 
          this.selectedPrestadoresAdvanced = this.tarjetaModificar.numePres != null ? this.listaPrestadores.find(item => item.key === this.tarjetaModificar.numePres)! : {};        
      });

    if (this.tarjetaModificar.pateMovi!.length > 0)
      this.deshabilitarDocumento = true;
    if (this.tarjetaModificar.numeDocu!= undefined)
      this.deshabilitarMovil = true;

    this.dropDownService.get('personal', undefined)
    .subscribe((listaPersonas: DropDownList[]) => {
        this.listaPersonas = listaPersonas; 
        if (this.accion == "Modificar" || this.accion == "Clonar" ) 
          this.selectedPersonaAdvanced = this.tarjetaModificar.numePers != null ? this.listaPersonas.find(item => item.key === this.tarjetaModificar.numePers)! : {};    
      });
    
    //Inicializo el nombre de la configuración de acuerdo a la acción
    
    switch (this.accion) {
      case "Nueva":        
        break;
      case "Modificar":
      case "Clonar":
        this.numeroTarjeta = this.tarjetaModificar.numeTarj!;
        this.valRadio = this.tarjetaModificar.numePres == null? "Persona" : "Prestador";
        this.marcayDescripcion = this.tarjetaModificar.nombMovi!;
        this.documento = this.tarjetaModificar.numeDocu?.toString()!;        
        this.patente = this.tarjetaModificar.pateMovi!;
        this.observacion = this.tarjetaModificar.descTarj!;
        break;  
      case "Entregar":
        this.numeroTarjeta = this.tarjetaModificar.numeTarj!;          
        this.marcayDescripcion = this.tarjetaModificar.nombMovi!;
        this.documento = this.tarjetaModificar.numeDocu?.toString()!;
        this.patente = this.tarjetaModificar.pateMovi!;
        this.observacion = this.tarjetaModificar.descTarj!;
        break;  
      default:
        break;
    }        
  }  

  limitarTarjeta(event: any) {
    // Obtener el valor del input y aplicar la validación
    let inputValue: string = event.target.value;
    
    // Aplicar la validación de solo números y máximo 17 caracteres
    inputValue = inputValue.replace(/[^0-9]/g, '').slice(0, 17);

    event.target.value = inputValue;
  }

  limitarPatente(event: any) {
    // Obtener el valor del input y aplicar la validación
    let inputValue: string = event.target.value;
    
    // Aplicar la validación de solo letras y numeros
    inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
  
    event.target.value = inputValue;

    this.deshabilitarDocumento = inputValue != "";    
  }

  limitarDocumento(event: any) {
    // Obtener el valor del input y aplicar la validación
    let inputValue: string = event.target.value;
    
    // Aplicar la validación de solo números y máximo 17 caracteres
    inputValue = inputValue.replace(/[^0-9]/g, '').slice(0, 11);

    event.target.value = inputValue;
    if (inputValue != "")
    {
      this.deshabilitarMovil = true;       
      this.marcayDescripcion ="";
    }
    else
      this.deshabilitarMovil = false;
  }

  async validarTarjeta(nroTarjeta: string): Promise<boolean> {        
      if (nroTarjeta.length <= 16) {
          this.numeroTarjetaError = "El número de tarjeta debe tener 17 digitos";
          return false;
      }
      
      try {
        if (this.accion == "Entregar" || this.accion == "Modificar")
          return true;

        const existeTarjeta = await this.buscarTarjeta(nroTarjeta).toPromise();
        
        if (existeTarjeta) {
            this.numeroTarjetaError = "Este número de tarjeta ya existe en el sistema";
            return false;
        } else {
            return true;
        }
      } catch (error) {
          console.error("Error al buscar la tarjeta:", error);
          return false;
      }
  }

  buscarTarjeta(numeTarj: string): Observable<boolean> {
    return this.administracionTarjetasService.getHistoricalData(numeTarj).pipe(
       map((tarjetaHistorico: string | any[]) => tarjetaHistorico.length > 0)
    );
   }   

  filterPrestador(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.listaPrestadores.length; i++) {
        const prestador = this.listaPrestadores[i];
        if (prestador.value != undefined &&  prestador.value!.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(prestador);
        }
    }

    this.filteredPrestadores = filtered;
  }

  filterPersona(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.listaPersonas.length; i++) {
        const persona = this.listaPersonas[i];
        if (persona.value != undefined && persona.value!.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(persona);
        }
    }

    this.filteredPersona = filtered;
  }

  async guardar() {    
    this.numeroTarjetaError = "";
    this.prestadorError = "";
    this.personaError = "";
    this.patenteError = "";
    this.generalError = "";
    
    if (this.numeroTarjeta == undefined || this.numeroTarjeta == ""){
      this.numeroTarjetaError = "Número de tarjeta obligatorio";      
      return;
    }

    if (!await this.validarTarjeta(this.numeroTarjeta)) 
      return;

    //tipocuenta 0 = prestador
    //Agregar que depende de que tipo de cuenta seleccione valide uno u otro
    if (this.valRadio == "Prestador" && this.selectedPrestadoresAdvanced == undefined){
      this.prestadorError = "Debe seleccionar un prestador";
      return;
    } 
    if (this.valRadio == "Persona" && this.selectedPersonaAdvanced == undefined){
      this.personaError = "Debe seleccionar una persona";
      return;
    }     

    if ((this.patente == undefined || this.patente == "") && (this.documento == undefined || this.documento == "")){
      this.generalError = "Se necesita ingresar una patente o un numero de documento.";
      return;
    } 

    if ((this.patente != undefined && this.patente != "") && (this.documento != undefined && this.documento != "")){
      this.generalError = "No puede ingresar una patente y un numero de documento al mismo tiempo.";
      return;
    } 
    
    if (this.accion == "Modificar")
    {
      this.aplicarDialog = true;
      this.header = "CONFIRMAR MODIFICACIONES"; 
      this.messageText = "¿Desea <B>aplicar</B> las modificaciones realizadas en la tarjeta N° <B>" + this.numeroTarjeta + "</B>?";
    }
    else
      this.guardarDatos();       
  }

  cancelar()
  {
    this.confirmarDialog = true;
    if (this.accion == "Nueva")
    {
      this.header = "CANCELAR NUEVA TARJETA"
      this.messageText = "¿Desea <B>descartar</B> la creación de una nueva tarjeta?"
    }
    else if (this.accion == "Modificar")
    {
      this.header = "CANCELAR MODIFICACIONES"
      this.messageText = "¿Desea <B>descartar</B> las modificaciones realizadas en la tarjeta <B>N°" + this.numeroTarjeta + "</B>?";
    }
    else
      this.ref.close("");
  }
  
  guardarDatos() {
    this.tarjeta.numeTarj = this.numeroTarjeta!;
    this.tarjeta.nombMovi = this.marcayDescripcion;    
    if (this.valRadio == "Prestador" && this.selectedPrestadoresAdvanced != undefined)
      this.tarjeta.numePres = parseInt(this.selectedPrestadoresAdvanced.key!);
    if (this.valRadio == "Persona" && this.selectedPersonaAdvanced != undefined)
      this.tarjeta.numePers = parseInt(this.selectedPersonaAdvanced.key!);
    this.tarjeta.pateMovi = this.patente;
    this.tarjeta.numeDocu = this.documento == "" ? undefined : parseInt(this.documento);
    this.tarjeta.descTarj = this.observacion;
    if (this.accion == "Nueva")
    {
      this.header = "NUEVA TARJETA CREADA";        
      this.administracionTarjetasService.Insert(this.tarjeta)
      .subscribe(     
          (response: MessageResponse) => { 
              this.messageDialog = true;
              this.messageText = response.mensaje;
            }         
        );
    }
    else if(this.accion == "Clonar"){
      this.tarjetaModificar.numeTarj = this.numeroTarjeta!;
      this.tarjetaModificar.nombMovi = this.marcayDescripcion;    
      if (this.valRadio == "Prestador" && this.selectedPrestadoresAdvanced != undefined)
        this.tarjetaModificar.numePres = parseInt(this.selectedPrestadoresAdvanced.key!);
      if (this.valRadio == "Persona" && this.selectedPersonaAdvanced != undefined)
        this.tarjetaModificar.numePers = parseInt(this.selectedPersonaAdvanced.key!);
      this.tarjetaModificar.pateMovi = this.patente;
      this.tarjetaModificar.numeDocu = this.documento == "" ? undefined : parseInt(this.documento);
      this.tarjetaModificar.descTarj = this.observacion;
      this.administracionTarjetasService.Clone(this.tarjetaModificar)
        .subscribe(
            (response: MessageResponse) => {                
                this.messageDialog = true;
                this.messageText = response.mensaje;                 
            } );
      }
    else if (this.accion == "Entregar"){
        this.entregarDialog = true;
      }
    else {       
      this.tarjeta.numeIden = this.tarjetaModificar.numeIden!;      
      this.administracionTarjetasService.Update(this.tarjeta)        
      .subscribe(
        (response: MessageResponse) => { 
          this.messageDialog = true;
          this.header = "TARJETA MODIFICADA";
          this.messageText = response.mensaje;           
        }         
      ); 
    }  
  }

  aceptarMensaje(){
    this.messageDialog = false;
    if (this.accion != "Nueva" &&  this.accion != "Clonar")
      this.ref.close(true);
    else
      this.ref.close(this.tarjeta.numeTarj);
  }

  confirmar(){
    this.confirmarDialog = false;
    if (this.accion == "Nueva" || this.accion == "Clonar")
      this.ref.close();    
    else if (this.accion == "Modificar" )
      this.ref.close(false);
  }

  aplicar(){
    this.guardarDatos();
    this.aplicarDialog = false;    
  }

  seguirEditando(){
    this.confirmarDialog = false;
    this.aplicarDialog = false;
  }

  entregar()
  {
    this.entregarDialog = false;
    this.tarjeta.numeIden = this.tarjetaModificar.numeIden!;
    this.tarjeta.fechEntr = this.fechaEntrega;
    if (this.valRadio == "Prestador" && this.selectedPrestadoresAdvanced != undefined)
      this.tarjeta.numePres = parseInt(this.selectedPrestadoresAdvanced.key!);
    if (this.valRadio == "Persona" && this.selectedPersonaAdvanced != undefined)
      this.tarjeta.numePers = parseInt(this.selectedPersonaAdvanced.key!);        

    this.administracionTarjetasService.Deliver(this.tarjeta)
    .subscribe(
      (response: MessageResponse) => {
          this.entregarDialog = false;
          if (response.retorno == 0)//si da error muestro mensaje
          {
              this.messageDialog = true;                
              this.messageText = response.mensaje;
          }
          else //sino traspaso consumos
            this.ref.close(true);
        }              
      );         
    }

}