import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
	formatLabel(value: number) {
		const startDate: Date = new Date(2021, 9, 12, 13, 40, 20, 11);
		const temp: number = startDate.getTime();
		startDate.setTime(startDate.getTime() + value * 86400000);
		const temp2: string = startDate.toDateString();
		return temp2;
	}
	ngOnInit(): void {}
}
