import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'bb-alert',
    template: require('./alert.component.html')
})


//Global alert component for application
export class AlertComponent implements AfterViewInit {
    @ViewChild('alertModal') public alertModal: ModalDirective;
    showAlerSubscription: Subscription;

    title = "";
    message = "";
    constructor(private alertService: AlertService) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this.showAlerSubscription.unsubscribe();
    }

    ngAfterViewInit() {
        this.showAlerSubscription = this.alertService.showAlertItem$
            .subscribe((msg) => {
                if (msg) {
                    this.title = msg.title;
                    this.message = msg.message;
                    this.alertModal.show();
                }
            });
    }
}
