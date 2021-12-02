import { map } from 'rxjs/operators';
import Neo4jService from '../services/neo4j-service';

/**
 * @param n4j Neo4jService (from angular)
 * @param q string (CYPHER-query)
 * @param p Dict (query params)
 */
export interface QueryParts {
	query: string;
	params?: Dict;
}

interface QueryPartsN4j extends QueryParts {
	neo4j: Neo4jService;
}

/**
 * Factory Class for Stat
 */
export class StatFactory {
	constructor(private neo4j: Neo4jService) {}
	new(label: string, q: QueryParts, unit?: string): Stat {
		return new Stat(label, { ...q, neo4j: this.neo4j }, unit);
	}
}

/**
 * Wrapper class for Stat data
 */
export class Stat {
	value?: number;

	/**
	 * @param label display Label of this stat
	 * @param value value to display
	 * @param unit unit to display (e.g. 'km' or 'times')
	 */
	constructor(label: string, value: number, unit?: string);
	/**
	 * @param label display Label of this stat
	 * @param q QueryPartsN4j to fetch this stat
	 * @param unit unit to display (e.g. 'km' or 'times')
	 */
	constructor(label: string, q: QueryPartsN4j, unit?: string);
	constructor(
		public label: string,
		q: QueryPartsN4j | number,
		public unit?: string
	) {
		if (typeof q === 'number') {
			this.value = q;
			return;
		}
		q.neo4j
			.query(q.query + ' as result', q.params)
			.pipe(map((record) => record.get('result')))
			.subscribe({
				next: (r) => (this.value = r),
				error: (error) => console.warn(error),
			});
	}
}

/**
 * Wrapper class for Stat-Group
 */
export class StatGroup {
	members: Stat[];
	title?: string;
	constructor(members: Stat[]);
	constructor(title: string, members: Stat[]);
	constructor(title: string | Stat[], m: Stat[] = []) {
		if (typeof title === 'string') {
			this.title = title;
			this.members = m;
		} else this.members = title;
	}
}
