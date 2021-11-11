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

@NgModule({
	declarations: [
		AppComponent,
		MapComponent,
		SliderComponent,
		ToolbarComponent,
		StatsComponent,
	],
	imports: [
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
