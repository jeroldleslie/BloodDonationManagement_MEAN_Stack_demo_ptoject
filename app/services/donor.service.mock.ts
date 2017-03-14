import { Observable, ReplaySubject } from 'rxjs';
import { Donor } from '../model/donor.interface';

export class MockDonorService {

    public fakeResponse: any = null;

    constructor() {
        spyOn(this, 'getAllUsers').and.callThrough();

    }

    public getAllUsers(): Observable<Donor[]> {
        let subject = new ReplaySubject();
        subject.next(this.fakeResponse);
        return subject;
    }

    public setResponse(response: any): void {
        this.fakeResponse = response;
    }
}