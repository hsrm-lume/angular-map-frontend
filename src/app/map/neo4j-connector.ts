import { Feature, Position } from 'geojson';
import { LngLat } from 'maplibre-gl';
import * as neo4j from 'neo4j-driver';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AgedLine, AgedPoint } from './AgedLine';

export interface DateRange {
	from: Date;
	to: Date;
}

export default class Neo4jConnector {
	driver: neo4j.Driver;
	constructor() {
		this.driver = neo4j.driver(
			'neo4j://localhost',
			neo4j.auth.basic('neo4j', 's3cr3t4')
		);
	}

	destroy() {
		this.driver.close();
	}

	geoJSON(
		filter: DateRange = {
			from: new Date('2000-01-01'),
			to: new Date('2999-12-31'),
		}
	): Observable<Feature> {
		const rxSession = this.driver.rxSession();
		return rxSession
			.run(
				`MATCH (a:User)-[:LIGHTS]->(b:User) 
				WHERE $d1 <= a.litTime <= $d2
				RETURN a,b`,
				{
					d1: filter.from.getTime(),
					d2: filter.to.getTime(),
				}
			)
			.records()
			.pipe(
				map((record) => [record.get('a'), record.get('b')]),
				map((pts) =>
					pts.map(
						(pt) =>
							new AgedPoint(
								new LngLat(
									pt.properties.lng,
									pt.properties.lat
								),
								new Date(pt.properties.litTime)
							)
					)
				),
				map(([a, b]) => new AgedLine(a, b)),
				map((l) => l.toGeoJsonFeature()),
				tap(() => rxSession.close())
			);
	}
}
