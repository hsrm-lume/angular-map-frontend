import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
	hideToolbar = false;
	constructor(private route: ActivatedRoute) {
		this.route.queryParams.subscribe((params) => {
			if (params.uuid) this.hideToolbar = true; // hide toolbar if in app view
		});
	}
	download() {
		window.location.href = environment.appDownloadUrl;
	}
}
