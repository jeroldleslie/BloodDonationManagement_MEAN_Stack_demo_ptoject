import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Donor } from '../model/donor.interface';
import { DonorService } from '../services/donor.service';
import { SocketService } from '../services/socket.service';
import Point = require('esri/geometry/Point');
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
    selector: 'donor-form',
    template: require('./donor-form.component.html')
})
export class DonorFormComponent implements OnInit {

    private donor: Donor;
    public bbForm: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
    id: string;
    private sub: any;


    @Input('geo-point')
    geoPoint: Point;

    @Input('manage-mode')
    manageMode: boolean = false;

    @Output()
    onSubmitSuccess = new EventEmitter();

    @Output()
    onUpdateSuccess = new EventEmitter();
    constructor(private _fb: FormBuilder, private donorService: DonorService, private socketService: SocketService, private alertService: AlertService, private route: ActivatedRoute, private router: Router) { }


//Default blood groups
    private bloodGroups: string[] = ['A Positive',
        'A Negative',
        'A Unknown',
        'B Positive',
        'B Negative',
        'B Unknown',
        'AB Positive',
        'AB Negative',
        'AB Unknown',
        'O Positive',
        'O Negative',
        'O Unknown',
        'Unknown'
    ];




    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id']; // (+) converts string 'id' to a number
            // In a real app: dispatch action to load the details here.

            if (this.id) {
                this.donorService.getDonor(this.id).subscribe(res => {
                    if (res) {
                        this.setData(res);
                    } else {
                        this.alertService.showAlert({ title: "Sorry!", message: "No account found with this ID" });
                    }
                }, err => {
                    let errMsg = "";
                    if (err.statusText === "Not Found") {
                        errMsg = "Account Not Found";
                    } else {
                        errMsg = JSON.stringify(err);
                    }
                    this.alertService.showAlert({ title: "Error!", message: errMsg });
                });
            }
        });

        // the long way
        this.bbForm = new FormGroup({
            _id: new FormControl(''),
            fname: new FormControl('', [<any>Validators.required, <any>Validators.minLength(1)]),
            lname: new FormControl(''),
            contactNum: new FormControl('', [<any>Validators.required, <any>Validators.minLength(10)]),
            email: new FormControl('', [<any>Validators.required]),
            address: new FormGroup({
                addr: new FormControl('', [<any>Validators.required]),
                city: new FormControl('', [<any>Validators.required]),
                state: new FormControl('', [<any>Validators.required]),
                country: new FormControl('', [<any>Validators.required]),
                pcode: new FormControl('', [<any>Validators.required])
            }),
            bloodGroup: new FormControl('', [<any>Validators.required]),
            location: new FormGroup({
                type: new FormControl('Point'),
                coordinates: new FormArray([
                    new FormControl(''), new FormControl('')
                ])
            })
        });
    }


    setData(donor) {
        this.donor = donor;
        (<FormGroup>this.bbForm)
            .setValue(donor, { onlySelf: true });

        if (donor.location) {
            this.geoPoint = new Point({
                x: donor.location.coordinates[0],
                y: donor.location.coordinates[1],
                spatialReference: 4326
            });
        }

    }

    clearForm() {
        this.bbForm.reset();
    }


    //Add or update donor
    save(event: Event, donor: Donor, isValid: boolean) {
        this.submitted = true;
        if (isValid) {
            if (!this.manageMode) {
                donor.location = {
                    coordinates: [this.geoPoint.longitude, this.geoPoint.latitude],
                    type: "Point"
                };
                this.donorService.addDonor(donor).subscribe((res) => {
                    this.onSubmitSuccess.next(res);
                    this.bbForm.reset();
                    this.alertService.showAlert({ title: "Awesome!", message: "Blood donor account created successfully added.\nYour DUID(Donor unique ID) is '" + res["_id"] + "'. You can use this for managing your account in future." });
                    this.socketService.donorAdded(res);
                });
            } else {
                this.donorService.updateDonor(donor).subscribe((res) => {
                    this.onUpdateSuccess.next(res);
                    this.alertService.showAlert({ title: "Awesome!", message: "Blood donor account successfully updated." });
                    this.socketService.donorUpdated(donor);
                });
            }
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

//Delete donor
    deleteDonor(event) {
        event.preventDefault();
        let con = confirm("Are you sure you want to remove your account?");
        if (con === true) {
            this.donorService.deleteDonor(this.donor._id).subscribe(res => {
                this.alertService.showAlert({ title: "Deleted Successfully!", message: "Your accout deleted successfully. You will be redirected to home page immediately." });
                this.router.navigateByUrl("/home");
                this.socketService.donorDeleted(this.donor);
            }, err => {
                this.alertService.showAlert({ title: "Oops!", message: "We are sorry that it cant able to delete accout due to some technical issue. Please try again later." });
            })
        }
    }
}
