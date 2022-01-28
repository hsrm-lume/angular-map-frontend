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
		// creates connection to neo4j database
		this.driver = neo4j.driver(
			environment.neo4j.url(this.document.location),
			neo4j.auth.basic(
				environment.neo4j.username,
				environment.neo4j.password
			)
		);
	}
	//close connection to the database
	ngOnDestroy(): void {
		this.driver.close();
	}
	// methods to execute the specified query with the specified parameters
	query(q: string, params: Dict = {}): Observable<neo4j.Record> {
		//neo4j session between database and webapp
		const rxSession = this.driver.rxSession();
		return rxSession
			.run(q, params)
			.records()
			.pipe(
				// Catch to display an error message
				catchError((e) => {
					this.messageService.push({
						type: 'error',
						text: 'Cant connect to the lume servers. Please try again soon.',
						title: 'Connectivity Issues',
					});
					console.warn(e);
					return of(null);
				}),
				finalize(() => rxSession.close()),
				filter((r) => r !== null), // filter out error events
				map((r) => r as neo4j.Record) // map all remaining observables to Record
			);
	}
}
