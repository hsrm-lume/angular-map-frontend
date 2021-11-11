import { HostListener, Component, OnInit } from '@angular/core';

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
			return 'Lume Mobile App 🔥';
		} else {
			return 'Lume Web App 🔥';
		}
	}
	formatLabel(value: number) {
		return new Date(value).toLocaleDateString().replace(/\.(?=\w+$)/, '. ');
	}

	circleMode(): void {
		console.log('Test');
	}
	lineMode(): void {
		console.log('Test');
	}
	ngOnInit(): void {
		this.onResize(null);
	}
}
