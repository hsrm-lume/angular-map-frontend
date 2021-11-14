import * as neo4j from 'neo4j-driver';
import { Feature, LineString, Point, Position } from 'geojson';
import { LngLat } from 'maplibre-gl';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export const mapToGeoJsonLine: OperatorFunction<
	neo4j.Record,
	Feature<LineString>
> = (source) =>
	source.pipe(
		map((record) => [record.get('a'), record.get('b')]),
		map((pts) =>
			pts.map(
				(pt) =>
					new AgedPoint(
						new LngLat(pt.properties.lng, pt.properties.lat),
						new Date(pt.properties.litTime.toInt())
					)
			)
		),
		map(([a, b]) => new AgedLine(a, b)),
		map((l) => l.toGeoJsonFeature())
	);

export const mapToGeoJsonPoint: OperatorFunction<
	neo4j.Record,
	Feature<Point>
> = (source) =>
	source.pipe(
		map((record) => record.get('a')),
		map(
			(pt) =>
				new AgedPoint(
					new LngLat(pt.properties.lng, pt.properties.lat),
					new Date(pt.properties.litTime.toInt())
				)
		),
		map((l) => l.toGeoJsonFeature())
	);

export class AgedPoint {
	constructor(public loc: LngLat, public age: Date) {}
	toGeoJsonFeature(): Feature<Point> {
		return {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [this.loc.lng, this.loc.lat],
			},
			properties: {
				time: this.age.getTime(),
			},
		};
	}
}

export class AgedLine {
	constructor(public from: AgedPoint, public to: AgedPoint) {}
	toPosArray(): Position[] {
		return [
			[this.from.loc.lng, this.from.loc.lat],
			[this.to.loc.lng, this.to.loc.lat],
		];
	}
	toGeoJsonFeature(): Feature<LineString> {
		return {
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: this.toPosArray(),
			},
			properties: {
				time: this.to.age.getTime(),
			},
		};
	}
}

// const renderRange = {
// 	start: Date.parse('2021-01-01'),
// 	end: Date.parse('2021-01-07'),
// };

// const getPercentageAge = (x: Date) =>
// 	(x.getTime() - renderRange.start) / (renderRange.end - renderRange.start);
