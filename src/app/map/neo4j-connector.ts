import { Feature, Position } from 'geojson';
import { LngLat } from 'maplibre-gl';
import * as neo4j from 'neo4j-driver';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AgedLine, AgedPoint } from './AgedLine';

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

	geoJSON(): Observable<Feature> {
		const rxSession = this.driver.rxSession();
		return rxSession
			.run('MATCH (a:User)-[:LIGHTS]->(b:User) RETURN a,b')
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
								pt.properties.age
							)
					)
				),
				map(([a, b]) => {
					return new AgedLine(a, b).toGeoJsonFeature();
				}), //record.get('rel')),
				tap(() => rxSession.close())
			);
	}
}
