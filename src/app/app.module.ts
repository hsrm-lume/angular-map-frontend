import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MapComponent } from './map/map.component';
import { NgxMapLibreGLModule } from 'ngx-maplibre-gl';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { SliderComponent } from './slider/slider.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StatsComponent } from './stats/stats.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		AppComponent,
		MapComponent,
		SliderComponent,
		ToolbarComponent,
		StatsComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatButtonToggleModule,
		MatSlideToggleModule,
		MatIconModule,
		MatToolbarModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatCardModule,
		NgxMapLibreGLModule,
		MatSidenavModule,
		MatSliderModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
