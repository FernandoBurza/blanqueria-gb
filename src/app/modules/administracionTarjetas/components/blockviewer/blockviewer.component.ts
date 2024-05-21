import { Component, EventEmitter, Input, Output } from '@angular/core';

enum BlockView {
    INICIO,
    NUEVA
}

@Component({
    selector: 'block-viewer',
    template: `
    <div class="block-section">
        <div class="block-header">
            <span class="block-title">
                <ul class="list-none p-0 m-0 flex align-items-left font-medium mb-3">
                    <li>                    
                        <a class="font-bold text-2xl mb-4 text-left">{{header}}</a>
                    </li>
                    <li class="px-2" *ngIf="submenu">
                        <i class="pi pi-angle-right font-bold text-2xl line-height-3"></i>
                    </li>
                    <li>
                        <span class="font-bold text-2xl mb-4 text-left" *ngIf="submenu">{{item2}}</span>
                    </li>
                </ul>                                
            </span>                    
        </div>
        <div class="block-content">
            <div [class]="containerClass" [ngStyle]="previewStyle" *ngIf="blockView === BlockView.INICIO">
                <ng-content></ng-content>
            </div>
        </div>
    </div>
  `,
    styleUrls: ['./blockviewer.component.scss']
})
export class BlockViewerComponent {
    @Input() header!: string;
    @Input() item2!: string;
    @Input() containerClass!: string;
    @Input() previewStyle!: object;
    @Input() submenu: boolean = true; 
    @Output() mostrarAccion = new EventEmitter<void>(); 

    BlockView = BlockView;
    blockView: BlockView = BlockView.INICIO;
}
