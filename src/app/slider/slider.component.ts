import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

// workarround for static formatLabel function
let displayWithTime = false;

@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
	@Input()
	portraitMode = false;

	@Output()
	dateChange = new EventEmitter<number>();

	@Output()
	indeterminateChange = new EventEmitter<boolean>();

	@Input()
	date: number = new Date().getTime();

	range: NumberRange = {
		from: environment.startDate,
		to: this.date,
	};

	// redirect slider change to parent
	change(event: any) {
		this.indeterminateChange.emit(true);
		this.date = event.value;
		this.dateChange.emit(event.value);
	}
	release(event: any) {
		this.indeterminateChange.emit(false);
	}
	//upper limit of the time interval
	private displayWithTime(): boolean {
		displayWithTime =
			this.range.to - this.range.from < 60 * 60 * 1000 * 24 * 7;
		return displayWithTime;
	}

	formatLabel(value: number) {
		// `this` cant be accessed in here
		if (displayWithTime)
			return new Date(value)
				.toLocaleString()
				.replace(/\d{2,4}(,| )+/, ' ') // remove year
				.replace(/:\d\d/, ''); // remove seconds
		return new Date(value).toLocaleDateString().replace(/\.(?=\w+$)/, '. '); // insert break after .
	}
	//text layout of the dates
	private stringOf(n: number): string {
		const d = new Date(n);
		if (
			!this.displayWithTime() &&
			d.toDateString() == new Date().toDateString()
		)
			return 'today';
		if (this.displayWithTime())
			return d.toLocaleString().replace(/:\d\d$/, '');
		return d.toLocaleDateString();
	}
	//returns the layout of the start or end date
	labelString(pos: 'start' | 'end'): string {
		if (this.portraitMode) {
			// swap labels in portrait mode
			if (pos == 'start') pos = 'end';
			else if (pos == 'end') pos = 'start';
		}
		const s = this.stringOf(
			pos == 'start' ? this.range.from : this.range.to
		);
		// changes text layout on potraitMode
		if (this.displayWithTime() && (this.portraitMode || pos == 'start'))
			return s.replace(/\d{2,4}(,| )+/, ' ');
		return s;
	}
	// get the string from the end ordate
	endString(): string {
		const s = this.stringOf(
			this.portraitMode ? this.range.to : this.range.from
		);
		if (this.portraitMode) return this.stringOf(this.range.from);
		return this.stringOf(this.range.to);
	}
	//changes the timelimts
	zoom(direction: 'in' | 'out') {
		const d = this.range.to - this.range.from;
		if (direction == 'out') {
			this.range.from -= d / 2;
			this.range.to += d / 2;
		} else {
			const p = ((this.date - this.range.from) / d) * 1.3 - 0.15;
			this.range.from += (d * p) / 4;
			this.range.to -= (d * (1 - p)) / 4;
		}
		this.range.from = Math.max(this.range.from, environment.startDate);
		this.range.to = Math.min(this.range.to, new Date().getTime());
	}
	// get the distance between every slider step
	get stepRange(): number {
		const d = this.range.to - this.range.from;
		return d / 356;
	}
	// get the distance between ervery tick (small lines on slider)
	get tickInterval(): number {
		const d = this.range.to - this.range.from;
		return 1000000000000 / d;
	}
}
