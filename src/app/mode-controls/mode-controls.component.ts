import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-mode-controls',
	templateUrl: './mode-controls.component.html',
	styleUrls: ['./mode-controls.component.scss'],
})
export class ModeControlsComponent {
	@Input()
	portraitMode = false;

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
}
