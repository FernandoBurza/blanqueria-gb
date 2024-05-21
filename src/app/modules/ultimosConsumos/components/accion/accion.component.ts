import { Component, Output, EventEmitter, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DropDownService } from 'src/app/shared/services/dropDown.service';
import { DropDownList } from 'src/app/Interfaces/dropDownList';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UltimosConsumosService } from '../../services/ultimosConsumos.service';
import { CombustibleTarjeta } from '../../models/combustibleTarjeta';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CombustibleConsumo } from '../../models/combustibleConsumo';

@Component({
  selector:'accion',
    templateUrl: './accion.component.html'
})

export class AccionComponent{

  progressBar!: boolean;

  constructor(public router: Router, private dropDownService: DropDownService, private loadingService: LoadingService, private ultimosConsumosService: UltimosConsumosService, public ref: DynamicDialogRef, @Inject(DynamicDialogConfig) public config: DynamicDialogConfig) { }
  
  ngOnInit(){
    this.loadingService.loading$.subscribe(loading => this.progressBar = loading);
      
  }  
  

}