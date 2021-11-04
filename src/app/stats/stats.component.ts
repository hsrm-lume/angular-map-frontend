import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
	constructor() {}
	burningTime() {
		const startDate: Date = new Date(2021, 1, 1, 12, 0, 0, 0);
		const now: Date = new Date();
		const burnTime: number =
			(now.getTime() - startDate.getTime()) / 86400000;
		return Math.round(burnTime * 1000) / 1000;
	}
	exchanges() {
		return Math.floor(Math.random() * 101);
	}
	firingTime =
		'The fire has been burning for ' + this.burningTime() + ' days';
	fireExchanges =
		'The fire has been passed on ' + this.exchanges() + ' times';
	ngOnInit(): void {}
}
