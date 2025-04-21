import { NgModule } from "@angular/core";
import { PopupDirective } from "./directives/popup.directive";

@NgModule({
    declarations: [PopupDirective],
    exports: [PopupDirective], 
  })
  export class DirectivesModule { }