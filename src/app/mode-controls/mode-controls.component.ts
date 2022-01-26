import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

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

	@Output()
	reloadClick = new EventEmitter();

	t(t: any): void {
		this.themeChange.emit(t ? 'dark' : 'light');
	}

	@Input()
	mapMode: MapMode = 'heatmap';

	@Output()
	mapModeChange = new EventEmitter();

	m(m: MatButtonToggleChange): void {
		if (m.value == '_') {
			m.source.buttonToggleGroup.writeValue(this.mapMode);
			this.reloadClick.emit();
		} else {
			this.mapModeChange.emit(m.value);
			this.mapMode = m.value;

		}
	}
}
