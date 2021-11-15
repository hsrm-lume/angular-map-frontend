import { HostListener, Component, OnInit } from '@angular/core';
import Neo4jService from '../services/neo4j-service';
import { StatGroup, Stat, StatFactory } from './StatsUtil';

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
	innerWidth = 0;
	innerHeight = 0;
	@HostListener('window:resize', ['$event'])
	onResize(_: any) {
		this.innerWidth = window.innerWidth;
		this.innerHeight = window.innerHeight;
	}
	get isVertical(): boolean {
		return this.innerWidth < 1100;
	}
	ngOnInit(): void {
		this.onResize(null);
	}
	constructor(public neo4j: Neo4jService) {}

	sf = new StatFactory(this.neo4j);

	statGroups: StatGroup[] = [
		new StatGroup([
			this.sf.new('Total active flames', {
				query: `MATCH (n) RETURN COUNT(n)`,
			}),
			this.sf.new(
				'Total distance fire has traveled',
				{
					query: `MATCH (r)-[:LIGHTS]->(u)
					WITH point({longitude: r.lng, latitude: r.lat}) AS p1, point({longitude: u.lng, latitude: u.lat}) AS p2
					RETURN round(SUM(distance(p1, p2)))`,
				},
				'km'
			),
		]),
		new StatGroup('personal', [
			this.sf.new(
				'Your fire got passed on',
				{
					query: `MATCH (n)-[*1..]->(m) WHERE n.uuid = $uuid RETURN COUNT(m)`,
					params: {
						uuid: '4bfa2ec7-7290-4b2b-b946-048796f006c4',
					},
				},
				' times'
			),
			this.sf.new(
				'You directly passed your flame',
				{
					query: `MATCH (n)-[*1]->(m) WHERE n.uuid = "<uuid>" RETURN COUNT(m)`,
					params: {
						uuid: '4bfa2ec7-7290-4b2b-b946-048796f006c4',
					},
				},
				' times'
			),
		]),
	];
}
