import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export default class Neo4jService implements OnDestroy {
	driver: neo4j.Driver;
	constructor(@Inject(DOCUMENT) private document: { location: any}) {
		this.driver = neo4j.driver(
			environment.neo4j.url(this.document.location),
			neo4j.auth.basic(
				environment.neo4j.username,
				environment.neo4j.password
			)
		);
	}
	ngOnDestroy(): void {
		this.driver.close();
	}

	query(q: string, params: Dict = {}) {
		const rxSession = this.driver.rxSession();
		return rxSession
			.run(q, params)
			.records()
			.pipe(tap(() => rxSession.close()));
	}
}
