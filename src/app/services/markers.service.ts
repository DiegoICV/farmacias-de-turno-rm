import { Injectable, OnInit } from '@angular/core';
import { Farmacia } from '../core/models/farmacias';



@Injectable()
export class MarkersService{
    constructor() {
       
    }
    
    
    public getMarkersFromFarmaciasList(farmacias: Array<Farmacia>): any{
        var markersNuevos = [];
        for( let index = 0; index<farmacias.length;index++){
            markersNuevos.push ({
                position: new google.maps.LatLng(farmacias[index].localLat,farmacias[index].localLng),
                icon: "../assets/icons/icon-pills-2.png"
            });
            
        }
        return markersNuevos;
    }
}