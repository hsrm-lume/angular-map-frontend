import { Component, OnDestroy, OnInit } from '@angular/core';
import Neo4jConnector from './neo4j-connector';
import { Feature } from 'geojson';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
	n4j: Neo4jConnector = new Neo4jConnector();

	features: Feature[] = [];

	ngOnInit(): void {
		this.n4j.geoJSON().subscribe({
			next: (data) => this.features.push(data),
			complete: () => {
				console.log('completed');
				console.log(this.features.length, 'Lines fetched');
			},
			error: (error) => console.log(error),
		});
	}
	ngOnDestroy(): void {
		this.n4j.destroy();
	}

	getStyleUrl(): string {
		return 'https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=db8eaf2341994e8d90a08f6ac3ff2adf';
		return 'https://maps.geoapify.com/v1/styles/dark-matter-dark-grey/style.json?apiKey=db8eaf2341994e8d90a08f6ac3ff2adf';
	}
}
