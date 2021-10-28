import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements AfterViewInit {
  
  constructor() { }

  ngAfterViewInit(): void {
     var mymap = L.map('mapid').setView([51.505, -0.09], 13);
  }

}
