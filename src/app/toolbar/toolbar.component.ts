import {
	HostListener,
	Component,
	OnInit,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
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
	title(): string {
		if (this.isVertical) {
			return 'Lume Map 🔥';
		} else {
			return 'Lume Web App🔥';
		}
	}
	@Input()
	theme: Theme = 'light';

	@Output()
	themeChange = new EventEmitter();

	t(t: any): void {
		this.themeChange.emit(t ? 'dark' : 'light');
	}

	@Input()
	mapMode: MapMode = 'heatmap';

	@Output()
	mapModeChange = new EventEmitter();

	m(m: any): void {
		this.mapModeChange.emit(m.value);
	}
	ngOnInit(): void {
		this.onResize(null);
	}
}
