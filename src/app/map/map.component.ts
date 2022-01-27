import { LinePaint, SymbolLayout, Map, Popup, HeatmapPaint } from 'maplibre-gl';
import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { Feature, LineString, Point } from 'geojson';
import Neo4jService from '../services/neo4j-service';
import {
	collectObserver,
	mapToGeoJsonLine,
	mapToGeoJsonPoint,
} from './MapUtil';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
	constructor(
		public neo4j: Neo4jService,
		private changeDetectorRef: ChangeDetectorRef
	) {}
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
		this.reloadData(true);
	}
	reloadData(initial: boolean = false): void {
		// query that returns every fire
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
			.pipe(
				mapToGeoJsonPoint,
				tap(() => {
					if (initial) this.zoomIn();
				})
			)
			.subscribe(collectObserver(this.points));
	}

	// filters & styles for map drawing
	get filters(): any[] {
		return ['<', ['number', ['get', 'time']], this.filter.to];
	}
	// set variables of the lines between the fires
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
				0,
			],
		};
	}
	// When a fire is clicked, connections to all parents and children are shown as lines
	get parentPaint(): LinePaint {
		return this.linesPaint('#713fad');
	}
	get childPaint(): LinePaint {
		return this.linesPaint('#fd3a3b');
	}
	// set variables for heatmap design
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
	//zoom animation
	ready = false;
	eventCount = 0;
	zoomIn() {
		this.eventCount++;
		// await eventCount of two: Tiles-Load & Neo4j-Load
		if (this.eventCount < 2) return;
		setTimeout(() => {
			this.ready = true;
			// do slow zooming
			setTimeout(() => {
				this.map?.easeTo({
					center: [8.235, 50.08],
					zoom: 12,
					duration: 7000,
				});
			}, 300);
		}, 300);
	}
	onPointClick(e: any) {
		if (!this.map) return;
		const features = this.map
			.queryRenderedFeatures(e.point)
			.filter((x) => x.layer.id == 'pts');
		if (features.length < 1) return;
		const f: Feature = features[0];
		new Popup({ anchor: 'top', closeButton: false })
			//if the fire is no longer selected
			.on('close', () => {
				this.neo4j
					.query(
						//query to display all fires again
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
				if (this.prevInspectUuid == f.properties?.uuid)
					this.inspectUuid.emit('');
				// clear all without changing reference:
				this.childpath.splice(0, this.childpath.length);
				this.parentpath.splice(0, this.parentpath.length);
				this.changeDetectorRef.detectChanges(); // mark component as changed
			})
			.setLngLat((f.geometry as any).coordinates)
			// shows date when lit below the fire
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
				//query to create a line between children and selected fire
				`MATCH (a:User)-[:LIGHTS]->(b:User)
				WITH a,b
				MATCH (c:User)-[:LIGHTS*0..]->(a)
				WHERE c.uuid = $uuid OR a.uuid = $uuid
				RETURN a,b`, //if a, or a parent from a has the UUID
				{ uuid: f.properties?.uuid }
			)
			.pipe(mapToGeoJsonLine)
			.subscribe(collectObserver(this.childpath));
		this.neo4j
			.query(
				//query to create a line between parents and selected fire
				`MATCH (a:User)-[:LIGHTS]->(b:User)
				WITH b,a
				MATCH (b)-[:LIGHTS*0..]->(c:User)
				WHERE c.uuid = $uuid OR b.uuid = $uuid
				RETURN a,b`, //If a, or a child from a has the UUID
				{ uuid: f.properties?.uuid }
			)
			.pipe(mapToGeoJsonLine)
			.subscribe(collectObserver(this.parentpath));
		//delete all fire points
		this.points.forEach(function (item, index, object) {
			if (item.properties?.uuid != f.properties?.uuid) {
				console.log(item.properties);
				console.log(f.properties);
				object.splice(index);
			}
		});
		//only loads fires who are related to the clicked fire
		this.neo4j
			.query(
				//child query
				`MATCH (a:User)
				WHERE $d1 <= a.litTime <= $d2
				WITH a
				MATCH (c:User)-[:LIGHTS*0..]->(a)
				WHERE c.uuid = $uuid OR a.uuid = $uuid
				RETURN a`,
				{
					d1: this.filter.from,
					d2: this.filter.to,
					uuid: f.properties?.uuid,
				}
			)
			.pipe(mapToGeoJsonPoint)
			.subscribe(collectObserver(this.points));
		this.neo4j
			.query(
				//parent query
				`MATCH (a:User)
				WHERE $d1 <= a.litTime <= $d2
				WITH a
				MATCH (a:User)-[:LIGHTS*0..]->(c)
				WHERE c.uuid = $uuid OR a.uuid = $uuid
				RETURN a`,
				{
					d1: this.filter.from,
					d2: this.filter.to,
					uuid: f.properties?.uuid,
				}
			)
			.pipe(mapToGeoJsonPoint)
			.subscribe(collectObserver(this.points));
	}
	//style url with the map layout
	getStyleUrl(): string {
		return `${environment.tileServerUrl}/styles/${this.theme}/style.json`;
	}
}
