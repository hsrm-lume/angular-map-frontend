import {
	HostListener,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';
//import { DateRange } from '../map/neo4j-connector';

const day = 60 * 60 * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
	// TODO Banana in a box
	dateFrom = new Date('2021-01-01');
	dateTo = new Date('2021-12-31');
	innerWidth = 0;
	innerHeight = 0;
	@Input()
	range: DateRange = {
		from: new Date('2021-01-01'),
		to: new Date('2021-12-31'),
	};

	@Output()
	dateChange = new EventEmitter();

	@Input()
	date?: number;

	get stepRange(): number {
		// const d = this.range.to.getTime() - this.range.from.getTime();
		return 60 * 60 * 1000 * 24;
	}

	// redirect slider change to parent
	change(event: any) {
		this.dateChange.emit(event.value);
	}

	@HostListener('window:resize', ['$event'])
	onResize(_: any) {
		this.innerWidth = window.innerWidth;
		this.innerHeight = window.innerHeight;
	}
	get isVertical(): boolean {
		return this.innerWidth < 1100;
	}
	formatLabel(value: number) {
		return new Date(value).toLocaleDateString().replace(/\.(?=\w+$)/, '. ');
	}

	startString(): string {
		return this.range.from.toLocaleDateString();
	}
	endString(): string {
		return this.range.to.toLocaleDateString();
	}

	ngOnInit(): void {
		this.onResize(null);
	}
}
