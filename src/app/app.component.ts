import { HostListener, Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	innerWidth = 0;
	innerHeight = 0;
	mapMode: MapMode = 'heatmap';
	theme: Theme = 'light';

	@HostListener('window:resize', ['$event'])
	onResize(_: any) {
		this.innerWidth = window.innerWidth;
		this.innerHeight = window.innerHeight;
		this.displayVertical = this.innerWidth < 1100;
	}
	displayVertical = false;
	selectedTstamp = new Date().getTime();
	get filter(): DateRange {
		return {
			from: new Date('2021-01-01'),
			to: new Date(this.selectedTstamp),
		};
	}
	ngOnInit(): void {
		this.onResize(null);
	}
}
