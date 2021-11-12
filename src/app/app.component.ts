import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	mapMode: MapMode = 'heatmap';
	theme: Theme = 'light';

	selectedTstamp = new Date().getTime();
	get filter(): DateRange {
		return {
			from: new Date('2021-01-01'),
			to: new Date(this.selectedTstamp),
		};
	}
}
