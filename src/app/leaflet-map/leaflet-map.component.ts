import { Component } from '@angular/core';
import * as L from 'leaflet';
import mock from './Mock';

@Component({
	selector: 'app-leaflet-map',
	templateUrl: './leaflet-map.component.html',
	styleUrls: ['./leaflet-map.component.scss'],
})
export class LeafletMapComponent {
	options = {
		layers: [
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: '...',
			}),
		],
		zoom: 5,
		center: L.latLng(46.879966, -121.726909),
	};
	layers: L.Polyline[] = mock.toAgedLines();

	onMapReady(m: L.Map) {
		m.invalidateSize();
		m.setView([50, 8.47], 11);
	}

	onMapClick(e: L.LeafletMouseEvent) {
		console.log('{ lat: ' + e.latlng.lat + ', lng: ' + e.latlng.lng + '}');
	}
}
