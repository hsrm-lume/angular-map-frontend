import { HostListener, Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
	constructor() {}
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
	firingTime = this.burningTime() ;
	fireExchanges = this.exchanges();
	ngOnInit(): void {
		this.onResize(null);
	}
}
