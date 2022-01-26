import {
	animate,
	animateChild,
	query,
	stagger,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { HostListener, Component, OnInit } from '@angular/core';
import { MessageService } from './services/message.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [
		// nice stagger effect when showing existing elements
		trigger('list', [
			transition(':enter', [
				// child animation selector + stagger
				query('@items', stagger(250, animateChild()), {
					optional: true,
				}),
			]),
		]),
		trigger('items', [
			// cubic-bezier for a tiny bouncing feel
			transition(':enter', [
				style({ transform: 'scale(0.5)', opacity: 0 }),
				animate(
					'.5s cubic-bezier(.8,0,0.2,1)',
					style({ transform: 'scale(1)', opacity: 1 })
				),
			]),
			transition(':leave', [
				style({ transform: 'scale(1)', opacity: 1, height: '*' }),
				animate(
					'.3s cubic-bezier(.8,0,0.2,1)',
					style({
						transform: 'scale(0)',
						opacity: 0,
						height: '0px',
						margin: '0em',
						padding: '0em',
					})
				),
			]),
		]),
	],
})
export class AppComponent implements OnInit {
	constructor(public messageService: MessageService) {}

	mapMode: MapMode = 'heatmap';
	theme: Theme = 'light';

	@HostListener('window:resize', ['$event'])
	onResize() {
		// switches to mobile view if the window width is smaller than the height and a specified pixel value
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
