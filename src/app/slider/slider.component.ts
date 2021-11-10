import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
	// TODO Banana in a box
	dateFrom = new Date('2021-01-01');
	dateTo = new Date('2021-12-31');

	formatLabel(value: number) {
		return new Date(value).toLocaleDateString().replace(/\.(?=\w+$)/, '. ');
	}

	startString(): string {
		return this.dateFrom.toLocaleDateString();
	}
	endString(): string {
		return this.dateTo.toLocaleDateString();
	}

	ngOnInit(): void {}
}
