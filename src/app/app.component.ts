import { HostListener, Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'angular-frontend';
	innerWidth = 0;
	innerHeight = 0;

	@HostListener('window:resize', ['$event'])
	onResize(_: any) {
		this.innerWidth = window.innerWidth;
		this.innerHeight = window.innerHeight;
	}
	get isVertical(): boolean {
		return this.innerWidth < 1000;
	}
	ngOnInit(): void {
		this.onResize(null);
	}
}
