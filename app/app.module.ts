import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PointsModel } from './model/points.model';
import { ModalModule } from 'ng2-bootstrap/modal';

import { AppComponent } from './app.component';
import { MapComponent } from './map.component';
import { HomePageComponent } from './homepage/homepage.component';
import { DonorFormComponent } from './donorform/donor-form.component';
import { ModifyDonorComponent } from './modifydonor/modifydonor.component';
import { AlertComponent } from './alert/alert.component';

import { MapService } from './services/map.service';
import { DonorService } from './services/donor.service';
import { SocketService } from './services/socket.service';
import { AlertService } from './services/alert.service';

// Imports commented out for brevity
import { RouterModule, Routes } from '@angular/router';

// Define the routes
const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'donor/:id', component: ModifyDonorComponent }
];


//add all neccessary modules, component, services for application
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ModalModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    HomePageComponent,
    MapComponent,
    DonorFormComponent,
    ModifyDonorComponent

  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    PointsModel,
    MapService,
    DonorService,
    SocketService,
    AlertService
  ]
})
export class AppModule {
  constructor() {

  }
}
