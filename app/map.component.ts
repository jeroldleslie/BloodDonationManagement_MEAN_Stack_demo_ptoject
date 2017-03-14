import { Component, OnInit, OnDestroy, ElementRef, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MapService } from './services/map.service';
import { ModalDirective } from 'ng2-bootstrap';

import MapView = require('esri/views/MapView');
import Point = require('esri/geometry/Point');
import ScreenPoint = require('esri/geometry/ScreenPoint');
import SpatialReference = require('esri/geometry/SpatialReference');
import watchUtils = require('esri/core/watchUtils');
import { DonorService } from './services/donor.service';
import { AlertService } from './services/alert.service';


@Component({
  selector: 'bb-map',
  template: require('./map.component.html')
})

export class MapComponent implements OnInit, OnDestroy {

  //Emitter for emit event after MapComponent initiated
  @Output()
  viewCreated = new EventEmitter();

  watchHandle = null;
  private mapView: MapView;
  private currentPoint: Point;
  private mapViewElement: HTMLDivElement;
  @ViewChild('donorModal') public donorModal: ModalDirective;

  constructor(private mapService: MapService, private donorService: DonorService,
    private elementRef: ElementRef, private alertService: AlertService) { }


  //Getting geolocation using geolocation API from browser. 
  //This may not work for some browser due to security reason.
  //But will work on secured connection
  getLocation(mapView: MapView, comp: MapComponent) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        mapView.goTo([position.coords.longitude, position.coords.latitude]);
      }, function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            comp.alertService.showAlert({ title: "Oops!", message: "User denied the request for Geolocation." });
            break;
          case error.POSITION_UNAVAILABLE:
            comp.alertService.showAlert({ title: "Oops!", message: "Location information is unavailable." });
            break;
          case error.TIMEOUT:
            comp.alertService.showAlert({ title: "Oops!", message: "The request to get user location timed out." });
            break;
          default:
            comp.alertService.showAlert({ title: "Oops!", message: "An unknown error occurred." });
            break;
        }
      });
    } else {
      comp.alertService.showAlert({ title: "Oops!", message: "Geolocation is not supported by this browser." });
    }
  }

  ngOnInit() {

    //Creating new Mapview
    this.mapView = new MapView({
      container: this.elementRef.nativeElement.firstChild,
      map: this.mapService.map,
      center: new Point({
        x: -94.1629,
        y: 34.5133,
        spatialReference: new SpatialReference({ wkid: 4326 })
      }),
      zoom: 10,

    });
    //ristrict map not to zoom less than 4.
    this.mapView.constraints.minZoom = 4;
    this.mapViewElement = <HTMLDivElement><any>this.mapView.container;
    this.mapViewElement.addEventListener('dblclick', <any>this);
    this.getLocation(this.mapView, this);
  }

  ngAfterViewInit() {
    this.viewCreated.next(this.mapView);
    let thisComp = this;

    this.mapView.on("layerview-create", function (evt) {
      if (thisComp.mapViewElement) {
        let coordinates = thisComp.getCoordinates();
        if (coordinates !== null) {
          thisComp.mapService.refreshMapView(coordinates);
        }
      }
    });
    this.watchHandle = watchUtils.whenTrue(thisComp.mapView, "stationary", function (evt) {
      if (thisComp.mapViewElement) {
        let coordinates = thisComp.getCoordinates();
        if (coordinates !== null) {
          thisComp.mapService.refreshMapView(coordinates);
        }
      }
    });
  }


  ngOnDestroy() {
    this.watchHandle.remove();
    if (this.mapViewElement) {
      this.mapViewElement.removeEventListener('dblclick', <any>this);
    }
  }

  private handleEvent(event: Event) {
    switch (event.type) {
      case 'dblclick':
        this.onMouseClick(<MouseEvent>event);
        break;
    }
  }

  private onFormSubmitSUccess() {
    this.donorModal.hide();
  }

  //Get four corner coordinates of map 
  private getCoordinates() {

    let coordinateArray = null;
    if (this.mapViewElement) {
      let rect = this.mapViewElement.getBoundingClientRect();

      let topLeftX = rect.left;
      let topLeftY = rect.top;
      topLeftX = topLeftX - rect.left;
      topLeftY = topLeftY - rect.top;

      let topRightX = rect.right;
      let topRightY = rect.top;
      topRightX = topRightX - rect.left;
      topRightY = topRightY - rect.top;

      let bottomRightX = rect.right;
      let bottomRightY = rect.bottom;
      bottomRightX = bottomRightX - rect.left;
      bottomRightY = bottomRightY - rect.top;

      let bottomLeftX = rect.left;
      let bottomLeftY = rect.bottom;
      bottomLeftX = bottomLeftX - rect.left;
      bottomLeftY = bottomLeftY - rect.top;


      let topLeftXLatLong = this.mapView.toMap(new ScreenPoint({
        x: topLeftX,
        y: topLeftY
      }));


      let topRightXLatLong = this.mapView.toMap(new ScreenPoint({
        x: topRightX,
        y: topRightY
      }));

      let bottomLeftXLatLong = this.mapView.toMap(new ScreenPoint({
        x: bottomLeftX,
        y: bottomLeftY
      }));

      let bottomRightXLatLong = this.mapView.toMap(new ScreenPoint({
        x: bottomRightX,
        y: bottomRightY
      }));

      if (topLeftXLatLong !== null) {
        coordinateArray = [[[topLeftXLatLong.longitude, topLeftXLatLong.latitude],
        [topRightXLatLong.longitude, topRightXLatLong.latitude],
        [bottomRightXLatLong.longitude, bottomRightXLatLong.latitude],
        [bottomLeftXLatLong.longitude, bottomLeftXLatLong.latitude],
        [topLeftXLatLong.longitude, topLeftXLatLong.latitude]
        ]];
      }
    }
    return coordinateArray;
  }


  //Get map lon,lat and show donor add screen
  private onMouseClick(e: MouseEvent) {
    let rect = this.mapViewElement.getBoundingClientRect();
    let point = new ScreenPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    this.currentPoint = this.mapView.toMap(point);

    if (this.currentPoint !== null) {
      this.donorModal.show();
    }
  }
}
