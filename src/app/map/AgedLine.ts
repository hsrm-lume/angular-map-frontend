import { Feature, LineString, Position } from 'geojson';
import { LngLat } from 'maplibre-gl';

export class AgedPoint {
	constructor(public loc: LngLat, public age: Date = new Date()) {}
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
		let f: Feature<LineString> = {
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: this.toPosArray(),
			},
			properties: {
				time: this.to.age.getTime(),
			},
		};
		return f;
	}
}

// const renderRange = {
// 	start: Date.parse('2021-01-01'),
// 	end: Date.parse('2021-01-07'),
// };

// const getPercentageAge = (x: Date) =>
// 	(x.getTime() - renderRange.start) / (renderRange.end - renderRange.start);
