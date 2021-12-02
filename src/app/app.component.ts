import { HostListener, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	mapMode: MapMode = 'heatmap';
	theme: Theme = 'light';

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.portraitMode =
			window.innerWidth < 1100 && window.innerWidth < window.innerHeight;
	}
	portraitMode = false;

	filter: NumberRange = {
		from: environment.startDate,
		to: new Date().getTime(),
	};
	sliderIndeterminate = false;
	indeterminateChange(e: boolean) {
		this.sliderIndeterminate = e;
	}

	ngOnInit(): void {
		this.onResize();
	}
}
