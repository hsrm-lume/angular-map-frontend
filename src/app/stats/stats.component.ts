import {
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Neo4jService from '../services/neo4j-service';
import { StatGroup, StatFactory } from './StatsUtil';

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnChanges {
	constructor(
		public neo4j: Neo4jService,
		private route: ActivatedRoute,
		private readonly changeDetector: ChangeDetectorRef
	) {}
	sf = new StatFactory(this.neo4j);

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			if (params.uuid) this.setPersonal(params.uuid);
		});
		this.ngOnChanges();
	}

	@Input()
	indeterminate = false;

	_filterRange: NumberRange = {
		from: environment.startDate,
		to: new Date().getTime(),
	};
	@Input()
	filterRange!: NumberRange;

	ngOnChanges(): void {
		// copy inp value to internal variable
		if (!this.indeterminate) {
			// spread for deep copy
			this._filterRange = { ...this.filterRange };
			this.loadGroups();
		}
	}

	get filterToString() {
		return new Date(this._filterRange.to).toLocaleDateString();
	}

	loadGroups(): void {
		this.loadMainGroup();
		this.loadPersonalGroup();
		this.loadInspectGroup();
	}

	// PERSONAL
	personalGroup = new StatGroup('personal', []);
	personalUuid: string = '';
	showLightFireMessage = false;
	setPersonal(uuid: string) {
		this.neo4j
			.query(`MATCH (n) WHERE n.uuid = $uuid RETURN COUNT(n) as result`, {
				uuid: uuid,
			})
			.pipe(map((record) => Number(record.get('result'))))
			.subscribe({
				complete: () => console.log('complete'),
				next: (count) => {
					console.log(uuid);
					console.log(count);
					if (count > 0) {
						this.personalUuid = uuid;
						this.loadPersonalGroup();
					} else this.showLightFireMessage = true;
				},
			});
	}
	private loadPersonalGroup() {
		if (this.personalUuid == '') {
			this.personalGroup.members = [];
			this.changeDetector.detectChanges();
			return;
		}
		this.personalGroup.members = [
			this.sf.new(
				'Your fire got passed on',
				{
					query: `MATCH (n)-[*1..]->(m) WHERE n.uuid = $uuid AND m.litTime <= $age RETURN COUNT(m)`,
					params: {
						uuid: this.personalUuid,
						age: this._filterRange.to,
					},
				},
				' times'
			),
			this.sf.new(
				'You directly passed your flame',
				{
					query: `MATCH (n)-[*1]->(m) WHERE n.uuid = $uuid AND m.litTime <= $age RETURN COUNT(m)`,
					params: {
						uuid: this.personalUuid,
						age: this._filterRange.to,
					},
				},
				' times'
			),
		];
	}

	// INSPECT
	inspectGroup = new StatGroup('clicked point', []);
	inspectUuid: string = '';
	setInspect(uuid: string) {
		this.inspectUuid = uuid;
		this.loadInspectGroup();
	}
	loadInspectGroup() {
		if (this.inspectUuid == '') {
			this.inspectGroup.members = [];
			this.changeDetector.detectChanges();
			return;
		}
		this.inspectGroup.members = [
			this.sf.new(
				'The clicked fire got passed on',
				{
					query: `MATCH (n)-[*1..]->(m) WHERE n.uuid = $uuid AND m.litTime <= $age RETURN COUNT(m)`,
					params: {
						uuid: this.inspectUuid,
						age: this._filterRange.to,
					},
				},
				' times'
			),
			this.sf.new(
				'The clicked fire got directly passed on',
				{
					query: `MATCH (n)-[*1]->(m) WHERE n.uuid = $uuid AND m.litTime <= $age RETURN COUNT(m)`,
					params: {
						uuid: this.inspectUuid,
						age: this._filterRange.to,
					},
				},
				' times'
			),
		];
	}

	// MAIN
	mainGroup = new StatGroup([]);
	loadMainGroup() {
		this.mainGroup.members = [
			this.sf.new('Total active flames', {
				query: `MATCH (n) WHERE n.litTime <= $age RETURN COUNT(n)`,
				params: {
					age: this._filterRange.to,
				},
			}),
			this.sf.new(
				'Total distance fire has traveled',
				{
					query: `MATCH (r)-[:LIGHTS]->(u)
					WHERE u.litTime <= $age
					WITH point({longitude: r.lng, latitude: r.lat}) AS p1, point({longitude: u.lng, latitude: u.lat}) AS p2
					RETURN round(SUM(distance(p1, p2))/1000)`,
					params: { age: this._filterRange.to },
				},
				'km'
			),
		];
	}

	statGroups: StatGroup[] = [
		this.mainGroup,
		this.personalGroup,
		this.inspectGroup,
	];
}
