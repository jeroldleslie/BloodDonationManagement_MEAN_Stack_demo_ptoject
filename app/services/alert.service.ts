import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AlertService {
    // Observable showAlertItem source
    private _showAlertSource = new BehaviorSubject<any>(0);
    // Observable showAlertItem stream
    showAlertItem$ = this._showAlertSource.asObservable();
    // service command
    showAlert(number) {
        this._showAlertSource.next(number);
    }

}