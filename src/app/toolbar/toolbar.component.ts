import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
	@Input()
	displayVertical = false;

	title(): string {
		if (this.displayVertical) {
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
}
