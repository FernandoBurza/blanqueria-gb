import { Directive, Input, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { PopupService } from 'src/app/shared/services/popup.service';
import { Dialog } from 'primeng/dialog';

@Directive({
  selector: '[appPopup]'
})
export class PopupDirective implements OnInit, OnDestroy {
  @Input() popupType: 'p-dialog' | 'dynamic-dialog' | undefined;
  @Input() popupInstance: Dialog | undefined; // Asegúrate de que sea del tipo correcto

  constructor(private popupService: PopupService, private el: ElementRef) {}

  ngOnInit() {
    if (this.popupInstance) {
      this.popupService.registerPopup({ type: this.popupType!, instance: this.popupInstance });
    }
  }

  ngOnDestroy() {
    if (this.popupInstance) {
      this.popupService.unregisterPopup({ type: this.popupType!, instance: this.popupInstance });
    }
  }
}