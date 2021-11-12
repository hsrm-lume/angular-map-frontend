import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Neo4jConnector, { DateRange } from './neo4j-connector';
import { Feature } from 'geojson';
import { LinePaint } from 'maplibre-gl';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
	n4j: Neo4jConnector = new Neo4jConnector();

	features: Feature[] = [];

	@Input()
	mode: MapMode = 'heatmap';

	@Input()
	theme: Theme = 'light';

	@Input()
	filter: DateRange = {
		from: new Date('2000-01-01'),
		to: new Date('2999-12-31'),
	}; // full open filter on init

	ngOnInit(): void {
		this.n4j.geoJSON(/*this.filter*/).subscribe({
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

	get filters(): any[] {
		return ['<', ['number', ['get', 'time']], this.filter.to.getTime()];
	}
	get linesPaint(): LinePaint {
		return {
			'line-width': ['interpolate', ['linear'], ['zoom'], 0, 1, 16, 2],
			// 'line-opacity': [
			// 	'interpolate',
			// 	['linear'],
			// 	['zoom'],
			// 	0,
			// 	1,
			// 	16,
			// 	0.5,
			// ],
			// 'line-color': [
			// 	'interpolate',
			// 	['linear'],
			// 	['get', 'time'],
			// 	this.filter.from.getTime(),
			// 	'#00ff00',
			// 	this.filter.to.getTime(),
			// 	'#ff0000',
			// ],
			'line-opacity': [
				'interpolate',
				['cubic-bezier', 0.7, 0, 1, 0.3],
				['get', 'time'],
				this.filter.to.getTime() - 1000 * 60 * 60 * 24 * 7 * 4 * 2, // show from 2 months ago
				0,
				this.filter.to.getTime(),
				1,
			],
			'line-color': '#ffaa00',
		};
	}

	getStyleUrl(): string {
		if (this.theme == 'light')
			return 'https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=db8eaf2341994e8d90a08f6ac3ff2adf';
		else
			return 'https://maps.geoapify.com/v1/styles/dark-matter-dark-grey/style.json?apiKey=db8eaf2341994e8d90a08f6ac3ff2adf';
	}
}
