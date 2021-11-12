import { Component, OnInit } from '@angular/core';

interface Stat {
	kind: 'stat';
	label: string;
	value: number | string;
	unit?: string;
}
interface Separator {
	kind: 'separator';
	label: string;
}

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
	constructor() {}

	stats: (Stat | Separator)[] = [
		{
			kind: 'stat',
			label: 'Total active flames',
			value: 2946,
		},
		{
			kind: 'stat',
			label: 'Total distance fire has traveled',
			value: 73841,
			unit: 'km',
		},
		{
			kind: 'separator',
			label: 'personal',
		},
		{
			kind: 'stat',
			label: 'Your fire got passed on',
			value: 182,
			unit: ' times',
		},
		{
			kind: 'stat',
			label: 'Your directly passed your flame',
			value: 23,
			unit: ' times',
		},
	];

	ngOnInit(): void {}
}
