import { Injectable } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

interface Popup {
  type: 'p-dialog' | 'dynamic-dialog';
  instance: any;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popups: Popup[] = [];

  registerPopup(popup: Popup) {
    this.popups.push(popup);
  }

  unregisterPopup(popup: Popup) {
    this.popups = this.popups.filter(p => p !== popup);
  }

  closeAllPopups() {
    for (const popup of this.popups) {
      if (popup.type === 'p-dialog') {
        popup.instance.visible = false;
      } else if (popup.type === 'dynamic-dialog' && popup.instance instanceof DynamicDialogRef) {
        popup.instance.close();
      }
    }
    this.popups = [];
  }
}
