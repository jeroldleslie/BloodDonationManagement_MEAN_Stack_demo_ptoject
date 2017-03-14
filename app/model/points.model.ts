import { Injectable } from '@angular/core';

import Graphic = require('esri/Graphic');
import GraphicsLayer = require('esri/layers/GraphicsLayer');
import Collection = require('esri/core/Collection');

@Injectable()
export class PointsModel {
    private points: Collection = new Collection();
    pointsLayer: GraphicsLayer;
    constructor() {
        this.pointsLayer = new GraphicsLayer();
        this.points = this.pointsLayer.graphics;
    }

    //add single graphics
    addPoint(pointGraphic: Graphic) {
        this.points.add(pointGraphic);
    }
    //add multiple graphics graphics
    addPoints(pointsGraphics: Graphic[]) {
        this.points.addMany(pointsGraphics);
    }


//Delete graphic
    deletePoint(pointGraphic: Graphic) {
        let selected: Graphic = this.points.find(function (pg) {
            return pg.attributes._id === pointGraphic.attributes._id
        });
        let index = this.points.indexOf(selected)
        this.points.removeAt(index);
    }

//update graphic
    updatePoint(pointGraphic: Graphic) {
        let selected: Graphic = this.points.find(function (pg) {
            return pg.attributes._id === pointGraphic.attributes._id
        });
        let index = this.points.indexOf(selected)
        this.points.removeAt(index);
        this.points.add(pointGraphic);
    }

    getPointGraphics() {
        return this.points;
    }
    clear() {
        this.points.removeAll();
    }
    getIndexSum() {
        let sum = 0;
        if (this.points !== null) {
            this.points.forEach(p => sum += p.attributes.index);
        }
        return sum;
    }
}
