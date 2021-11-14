import { Component, Input, OnInit } from '@angular/core';
import { Feature, LineString, Point } from 'geojson';
import { LinePaint } from 'maplibre-gl';
import Neo4jService from '../services/neo4j-service';
import {
	collectObserver,
	mapToGeoJsonLine,
	mapToGeoJsonPoint,
} from './MapUtil';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
	constructor(public neo4j: Neo4jService) {}
	lines: Feature<LineString>[] = [];
	points: Feature<Point>[] = [];

	@Input()
	mode: MapMode = 'heatmap';

	@Input()
	theme: Theme = 'light';

	@Input()
	filter: DateRange = {
		from: new Date('2000-01-01'),
		to: new Date('2999-12-31'),
	}; // full open filter on init

	// Loads map data on init
	ngOnInit(): void {
		// LINES
		this.neo4j
			.query(
				`MATCH (a:User)-[:LIGHTS]->(b:User)
				WHERE $d1 <= a.litTime <= $d2
				RETURN a,b`,
				{
					d1: this.filter.from.getTime(),
					d2: this.filter.to.getTime(),
				}
			)
			.pipe(mapToGeoJsonLine)
			.subscribe(collectObserver(this.lines));
		// POINTS
		this.neo4j
			.query(
				`MATCH (a:User)
				WHERE $d1 <= a.litTime <= $d2
				RETURN a`,
				{
					d1: this.filter.from.getTime(),
					d2: this.filter.to.getTime(),
				}
			)
			.pipe(mapToGeoJsonPoint)
			.subscribe(collectObserver(this.points));
	}

	// filters & styles for map drawing
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
