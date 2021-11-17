import * as neo4j from 'neo4j-driver';
import { Feature, LineString, Point, Position } from 'geojson';
import { LngLat } from 'maplibre-gl';
import { OperatorFunction, PartialObserver } from 'rxjs';
import { map } from 'rxjs/operators';

const toAgedPoint = (pt: any): AgedPoint =>
	new AgedPoint(
		pt.properties.uuid,
		new LngLat(pt.properties.lng, pt.properties.lat),
		new Date(pt.properties.litTime.toNumber())
	);

/**
 * @param source
 * @returns an Operator that maps a neo4j record to a geojson LineString
 */
export const mapToGeoJsonLine: OperatorFunction<
	neo4j.Record,
	Feature<LineString>
> = (source) =>
	source.pipe(
		map((record) => [record.get('a'), record.get('b')]),
		map((pts) => pts.map(toAgedPoint)),
		map(([a, b]) => new AgedLine(a, b)),
		map((l) => l.toGeoJsonFeature())
	);

/**
 * @param source the source to be mapped
 * @returns an Operator that maps a neo4j record to a geojson Point
 */
export const mapToGeoJsonPoint: OperatorFunction<
	neo4j.Record,
	Feature<Point>
> = (source) =>
	source.pipe(
		map((record) => record.get('a')),
		map(toAgedPoint),
		map((p) => p.toGeoJsonFeature())
	);

/**
 * @param collection the collection where Features are stored
 * @returns an Observer that logs complete & error events along with collection
 */
export const collectObserver = (
	collection: Feature[]
): PartialObserver<Feature> => ({
	next: (l) => collection.push(l),
	complete: () => {
		console.log('completed');
		console.log(collection.length, ' fetched');
	},
	error: (error) => console.warn(error),
});

class AgedPoint {
	constructor(public uuid: string, public loc: LngLat, public age: Date) {}
	toGeoJsonFeature(): Feature<Point> {
		return {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [this.loc.lng, this.loc.lat],
			},
			properties: {
				uuid: this.uuid,
				time: this.age.getTime(),
			},
		};
	}
}

class AgedLine {
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
