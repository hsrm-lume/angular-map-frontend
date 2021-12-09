import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MapComponent } from './map/map.component';
import { SliderComponent } from './slider/slider.component';
import { StatsComponent } from './stats/stats.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgxMapLibreGLModule } from 'ngx-maplibre-gl';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				MatButtonToggleModule,
				MatSidenavModule,
				MatSlideToggleModule,
				BrowserAnimationsModule,
				MatToolbarModule,
				MatIconModule,
				NgxMapLibreGLModule,
				MatSliderModule,
				MatCardModule,
				FormsModule,
			],
			declarations: [
				AppComponent,
				ToolbarComponent,
				MapComponent,
				SliderComponent,
				StatsComponent,
			],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
