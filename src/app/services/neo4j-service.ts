import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { Observable, of } from 'rxjs';
import { catchError, filter, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';

@Injectable({
	providedIn: 'root',
})
export default class Neo4jService implements OnDestroy {
	driver: neo4j.Driver;
	constructor(
		@Inject(DOCUMENT) private document: { location: any },
		private messageService: MessageService
	) {
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

	query(q: string, params: Dict = {}): Observable<neo4j.Record> {
		const rxSession = this.driver.rxSession();
		return rxSession
			.run(q, params)
			.records()
			.pipe(
				catchError((e) => {
					this.messageService.push({
						type: 'error',
						text: 'Bitte später erneut versuchen.',
						title: 'Datenbankfehler',
					});
					return of(null);
				}),
				finalize(() => rxSession.close()),
				filter((r) => r !== null), // filter out error events
				map((r) => r as neo4j.Record) // map all remaining observables to Record
			);
	}
}
