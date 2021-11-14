import { Injectable, OnDestroy } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export default class Neo4jService implements OnDestroy {
	driver: neo4j.Driver;
	constructor() {
		this.driver = neo4j.driver(
			'neo4j://localhost',
			neo4j.auth.basic('neo4j', 's3cr3t4')
		);
	}
	ngOnDestroy(): void {
		this.driver.close();
	}

	query(q: string, params?: Dict) {
		const rxSession = this.driver.rxSession();
		return rxSession
			.run(q, params)
			.records()
			.pipe(tap(() => rxSession.close()));
	}
}
