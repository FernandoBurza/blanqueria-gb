import { Component, OnDestroy, OnInit } from '@angular/core';
import { GtcNotificationService } from '../../services/gtc-notification.service';
import { Subscription } from 'rxjs';
import { GtcProcessedResponse } from '../../models/gtc-processed-response';
import { SignalRService } from '../../services/signalR.service';

@Component({
  selector: 'app-process-timeline-gtc',
  templateUrl: './process-timeline-gtc.component.html',
  styleUrls: ['./process-timeline-gtc.component.scss']
})

export class ProcessTimelineGtcComponent implements OnInit, OnDestroy {

  currentEventIndex = 0;
  showPercentageAnimation: boolean = false;
  showDivResponse: boolean = false;
  gtcProcessedResponse: GtcProcessedResponse[]  = [];
  subscription: Subscription[] = [];

  constructor(public notificationService: GtcNotificationService,
              public signalRService: SignalRService) {}

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener(); 
    this.signalRService.addTransferErrorListener();
    
    this.subscription.push(this.notificationService.showDiv().subscribe(show => {
      this.showPercentageAnimation = show;
      if(!this.showPercentageAnimation){
        setTimeout(() => {
          this.signalRService.processingSteps = [];
          this.showDivResponse = true;
        }, 1000);
      }
    }));

    this.subscription.push(this.notificationService.listen().subscribe(response => { 
      this.gtcProcessedResponse = response;
    }));
  }

  ngOnDestroy() {
    this.subscription.forEach(x => x.unsubscribe());
  }
}