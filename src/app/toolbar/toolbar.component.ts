import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
	download() {
		window.location.href = environment.appDownloadUrl;
	}
}
