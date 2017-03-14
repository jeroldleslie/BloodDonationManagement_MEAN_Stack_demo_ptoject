import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import 'rxjs/Rx';
import { Donor } from '../model/donor.interface';

@Injectable()
export class SocketService {
    private _socket: any = null;
    get socket(): any {
        return this._socket;
    }
    constructor() {
        this._socket = io('//');
    }

    donorAdded(donor: Donor) {
        this.doEmit('donorAdded', donor);
    }
    donorDeleted(donor: Donor) {
        this.doEmit('donorDeleted', donor);
    }
    donorUpdated(donor: Donor) {
        this.doEmit('donorUpdated', donor);
    }

    doEmit(event: String, donor: Donor) {
        this._socket.emit(event, JSON.stringify(donor));
    }
}
