import { Injectable } from '@angular/core';

import Map = require('esri/Map');
import GraphicsLayer = require('esri/layers/GraphicsLayer');

import { Donor } from '../model/donor.interface';
import { PointsModel } from '../model/points.model';
import { DonorService } from '../services/donor.service';
import PopupTemplate = require('esri/PopupTemplate');
import Graphic = require('esri/Graphic');
import Point = require('esri/geometry/Point');
import PictureMarkerSymbol = require('esri/symbols/PictureMarkerSymbol');

import { Observable } from 'rxjs/Observable';
import SocketService = require('../services/socket.service');
import * as io from 'socket.io-client';
import 'rxjs/Rx';

@Injectable()
export class MapService {
  map: Map;
  socket: any = null;
  pointGraphicsLayer: GraphicsLayer;
  private popuptemplate: PopupTemplate = new PopupTemplate();


  private pictureMarkerSymbol: PictureMarkerSymbol = new PictureMarkerSymbol({
    url: "img/m24.png",
    width: 15,
    height: 24
  });


  constructor(private pointsModel: PointsModel, private donorService: DonorService) {
    this.map = new Map({
      basemap: 'streets'
    });
    this.map.add(pointsModel.pointsLayer);

    this.popuptemplate.title = "Blood Donor Info";
    this.popuptemplate.content = `    
                                <table style="width:100%">
                                <tr>
                                    <th><b>Name</b></th>
                                    <td>{fname} {lname}</td>
                                </tr>
                                <tr>
                                    <th><b>Blood Group</b></th>
                                    <td>{bloodGroup}</td>
                                </tr>
                                <tr>
                                    <th><b>Contact Details</b></th>
                                    <td><div id="emailPhone"></div>
                                    <label id="showHideLbl" onClick="document.getElementById('emailPhone').innerHTML ='<span>{email}</span><br><span>{contactNum}</span>';document.getElementById('showHideLbl').style.display='none'" style="cursor: pointer; color: dodgerblue">Click to show</label></td>
                                </tr>
                                </table>
                                `;

    this.socket = io('//');

    let listener = Observable.fromEvent(this.socket, "updateMap");
    listener.subscribe((data) => {
      if (data['type'] === 'donorAdded') {
        this.addPoint(data['donor']);
      } else if (data['type'] === 'donorUpdated') {
        this.updatePoint(data['donor']);
      } else if (data['type'] === 'donorDeleted') {
        this.deletePoint(data['donor']);
      }
    });
  }


  refreshMapView(coordinates) {
    this.pointsModel.clear();
    let query = {
      location: { $geoWithin: { $geometry: { type: "Polygon", coordinates: coordinates } } }
    }

    this.donorService.filterDonors(query).subscribe(res => {
      this.addPoints(res)
    });
  }

  addPoints(donors: Donor[]) {
    let pointsGraphics: Graphic[] = [];
    donors.forEach(ele => {
      if (ele.location) {
        pointsGraphics.push(this.createGraphic(ele));
      }
    });
    this.pointsModel.addPoints(pointsGraphics);
  }

  updatePoint(donorStr: string) {
    let donor: Donor = JSON.parse(donorStr);
    this.pointsModel.updatePoint(this.createGraphic(donor));
  }

  deletePoint(donorStr: string) {

    let donor: Donor = JSON.parse(donorStr);
    this.pointsModel.deletePoint(this.createGraphic(donor));
  }

  addPoint(donorStr: string) {
    let donor: Donor = JSON.parse(donorStr);
    if (donor.location) {
      this.pointsModel.addPoint(this.createGraphic(donor));
    }
    donor.bloodGroup
  }

  createGraphic(donor: Donor): Graphic {
    return new Graphic({
      geometry: new Point({
        x: donor.location.coordinates[0],
        y: donor.location.coordinates[1],
        spatialReference: 4326
      }),
      attributes: donor,
      symbol: this.pictureMarkerSymbol,
      popupTemplate: this.popuptemplate
    });
  }

}
