import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Neo4jService from '../services/neo4j-service';
import { StatGroup, StatFactory } from './StatsUtil';

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
	constructor(
		public neo4j: Neo4jService,
		private route: ActivatedRoute,
		private readonly changeDetector: ChangeDetectorRef
	) {}
	sf = new StatFactory(this.neo4j);

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			if (params.uuid) this.loadPersonalGroup(params.uuid);
		});
	}

	personalGroup = new StatGroup('personal', []);
	private loadPersonalGroup(uuid: string) {
		this.personalGroup.members = [
			this.sf.new(
				'Your fire got passed on',
				{
					query: `MATCH (n)-[*1..]->(m) WHERE n.uuid = $uuid RETURN COUNT(m)`,
					params: { uuid: uuid },
				},
				' times'
			),
			this.sf.new(
				'You directly passed your flame',
				{
					query: `MATCH (n)-[*1]->(m) WHERE n.uuid = $uuid RETURN COUNT(m)`,
					params: { uuid: uuid },
				},
				' times'
			),
		];
	}

	inspectGroup = new StatGroup('clicked point', []);
	loadInspectGroup(uuid: string) {
		if (uuid == '') {
			this.inspectGroup.members = [];
			this.changeDetector.detectChanges();
			return;
		}
		this.inspectGroup.members = [
			this.sf.new(
				'The clicked fire got passed on',
				{
					query: `MATCH (n)-[*1..]->(m) WHERE n.uuid = $uuid RETURN COUNT(m)`,
					params: {
						uuid: uuid,
					},
				},
				' times'
			),
			this.sf.new(
				'The clicked fire got directly passed on',
				{
					query: `MATCH (n)-[*1]->(m) WHERE n.uuid = $uuid RETURN COUNT(m)`,
					params: { uuid: uuid },
				},
				' times'
			),
		];
	}

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
		this.personalGroup,
		this.inspectGroup,
	];
}
