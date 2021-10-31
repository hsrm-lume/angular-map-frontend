import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
	selector: 'app-leaflet-map',
	templateUrl: './leaflet-map.component.html',
	styleUrls: ['./leaflet-map.component.scss'],
})
export class LeafletMapComponent implements AfterViewInit {
	constructor() {}

	ngAfterViewInit(): void {
		var mymap = L.map('mapid').setView([51.505, -0.09], 13);
		L.tileLayer(
			'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
			{
				attribution:
					'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox/streets-v11',
				tileSize: 512,
				zoomOffset: -1,
				accessToken: 'your.mapbox.access.token',
			}
		).addTo(mymap);
	}
}
