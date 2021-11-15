import { HostListener, Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	mapMode: MapMode = 'heatmap';
	theme: Theme = 'light';

	@HostListener('window:resize', ['$event'])
	onResize(_: any) {
		this.portraitMode =
			window.innerWidth < 1100 && window.innerWidth < window.innerHeight;
	}
	portraitMode = false;
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
