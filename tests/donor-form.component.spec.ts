import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
    inject,
    TestBed,
    getTestBed,
    async,
    fakeAsync,
    ComponentFixture
} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DonorFormComponent } from '../app/donorform/donor-form.component';
import { SocketService } from '../app/services/socket.service';
import { AlertService } from '../app/services/alert.service';
import { DonorService } from '../app/services/donor.service';
import { MockDonorService } from '../app/services/donor.service.mock';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let comp: DonorFormComponent;
let fixture: ComponentFixture<DonorFormComponent>;

class MockRouter { createUrlTree() { } }
class MockActivatedRoute {
    public params = new BehaviorSubject<any>(0).asObservable()

}


describe('DonorFormComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DonorFormComponent],
            providers: [
                FormBuilder,
                SocketService,
                AlertService,


            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .overrideComponent(DonorFormComponent, {
                set: {
                    providers: [
                        { provide: DonorService, useClass: MockDonorService },
                        { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'id': 1 }]) } },
                        { provide: Router, useClass: MockRouter }
                    ]
                }
            })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(DonorFormComponent);
                comp = fixture.componentInstance;
            });
    }));

    /*it('email field validity', () => {
    let email = comp.bbForm.controls['email'];
    expect(email.valid).toBeFalsy();
});*/


});