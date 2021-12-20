import { LinePaint, SymbolLayout, Map, Popup, HeatmapPaint } from 'maplibre-gl';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Feature, LineString, Point } from 'geojson';
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
	constructor(public neo4j: Neo4jService, private changeDetectorRef: ChangeDetectorRef) { }
	parentpath: Feature<LineString>[] = [];
	childpath: Feature<LineString>[] = [];
	points: Feature<Point>[] = [];

	map?: Map;

	@Input()
	mode: MapMode = 'heatmap';

	@Input()
	theme: Theme = 'light';

	@Input()
	filter: NumberRange = {} as NumberRange;

	// the UUID of clicked point
	@Output()
	inspectUuid = new EventEmitter<string>();

	// Loads map data on init
	ngOnInit(): void {
		// POINTS
		this.neo4j
			.query(
				`MATCH (a:User)
				WHERE $d1 <= a.litTime <= $d2
				RETURN a`,
				{
					d1: this.filter.from,
					d2: this.filter.to,
				}
			)
			.pipe(mapToGeoJsonPoint)
			.subscribe(collectObserver(this.points));
	}

	// filters & styles for map drawing
	get filters(): any[] {
		return ['<', ['number', ['get', 'time']], this.filter.to];
	}
	linesPaint(color: string): LinePaint {
		return {
			'line-width': ['interpolate', ['linear'], ['zoom'], 0, 1, 16, 2],
			'line-color': color,
			'line-opacity': [
				'interpolate',
				['cubic-bezier', 0.7, 0, 1, 0.3],
				['get', 'time'],
				this.filter.to - 1000 * 60 * 60 * 24 * 7 * 4 * 2, // show from 2 months ago
				0.1,
				this.filter.to, // current time is max
				1,
				this.filter.to + 1, // dont show future
				0
			],
		}
	}
	get parentPaint(): LinePaint {
		return this.linesPaint('#713fad');
	}
	get childPaint(): LinePaint {
		return this.linesPaint('#fd3a3b');
	}
	get heatmapPaint(): HeatmapPaint {
		return {
			'heatmap-radius': [
				'interpolate',
				['linear'],
				['zoom'],
				0,
				2,
				9,
				20,
			],
			'heatmap-color': [
				'interpolate',
				['linear'],
				['heatmap-density'],
				0,
				'rgba(113, 63, 173, 0)',
				0.33,
				'rgba(160, 62, 136, 0.8)',
				0.66,
				'rgba(216, 59, 90, 1)',
				1,
				'rgba(253, 58, 59, 1)',
			],
		};
	}
	pointLayout: SymbolLayout = {
		'icon-image': 'fire',
		'icon-anchor': 'bottom',
		'icon-allow-overlap': false,
		'icon-padding': 0,
	};

	prevInspectUuid = '';
	onPointClick(e: any) {
		if (!this.map) return;
		const features = this.map
			.queryRenderedFeatures(e.point)
			.filter((x) => x.layer.id == 'pts');
		if (features.length < 1) return;
		const f: Feature = features[0];
		new Popup({ anchor: 'top', closeButton: false })
			.on('close', () => {
				if (this.prevInspectUuid == f.properties?.uuid)
					this.inspectUuid.emit('');
				// clear all without changing reference:
				this.childpath.splice(0, this.childpath.length);
				this.parentpath.splice(0, this.parentpath.length);
				this.changeDetectorRef.detectChanges(); // mark component as changed
			})
			.setLngLat((f.geometry as any).coordinates)
			.setHTML(
				'<span>' +
				new Date(f.properties?.time || 0).toLocaleDateString() +
				'</span>'
			)
			.addTo(this.map);
		this.inspectUuid.emit(f.properties?.uuid);
		this.prevInspectUuid = f.properties?.uuid;
		this.neo4j
			.query(
				`MATCH (a:User)-[:LIGHTS]->(b:User)
				WITH a,b
				MATCH (c:User)-[:LIGHTS*0..]->(a)
				WHERE c.uuid = $uuid OR a.uuid = $uuid
				RETURN a,b`, //Wenn A, oder ein Parent von A die angeklickte UUID hat.
				{ uuid: f.properties?.uuid }
			)
			.pipe(mapToGeoJsonLine)
			.subscribe(collectObserver(this.childpath));
		this.neo4j
			.query(
				`MATCH (a:User)-[:LIGHTS]->(b:User)
				WITH b,a
				MATCH (b)-[:LIGHTS*0..]->(c:User)
				WHERE c.uuid = $uuid OR b.uuid = $uuid
				RETURN a,b`, //Wenn A, oder ein Child von A die angeklickte UUID hat.
				{ uuid: f.properties?.uuid }
			)
			.pipe(mapToGeoJsonLine)
			.subscribe(collectObserver(this.parentpath));
	}

	getStyleUrl(): string {
		if (this.theme == 'light')
			return 'https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=db8eaf2341994e8d90a08f6ac3ff2adf';
		else
			return 'https://maps.geoapify.com/v1/styles/dark-matter-dark-grey/style.json?apiKey=db8eaf2341994e8d90a08f6ac3ff2adf';
	}
}
