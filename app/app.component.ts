import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DonorService } from './services/donor.service';
import { AlertService } from './services/alert.service';


@Component({
  selector: 'bb-app',
  template: require('./app.component.html')
})
export class AppComponent implements OnInit {

  logoSrc = "img/logo.png";
  homePage = true;
  bdid = "";
  welcomeName = "";

  constructor(private router: Router, private donorService: DonorService, private alertService: AlertService) {

  }

  ngOnInit() {

  }
//redirect to manage page
  goManagePage() {
    if (this.bdid) {
      this.donorService.getDonor(this.bdid).subscribe(res => {
        if (!res) {
          this.alertService.showAlert({ title: "Sorry!", message: "No account found with this ID" });
        } else {
          this.welcomeName = res.fname + " " + res.lname;
          this.router.navigateByUrl("/donor/" + this.bdid);
          this.homePage = false;
        }
      }, err => {
        this.alertService.showAlert({ title: "Error!", message: "Account Not Found" });
      });

    } else {
      this.alertService.showAlert({ title: "Alert!", message: "Please enter you Blood donor unique ID (BDID)" });
    }
  }

//redirect to home page
  goHomePage() {
    this.homePage = true;
    this.router.navigateByUrl("/home");
  }





}

