import { Component, EventEmitter, Output } from '@angular/core';

interface IntroItem {
	icon: string;
	headline: string;
	text: string;
}

@Component({
	selector: 'app-intro',
	templateUrl: './intro.component.html',
	styleUrls: ['./intro.component.scss'],
})
export class IntroComponent {
	@Output()
	toggleIntro = new EventEmitter();

	currentIndex = 0;
	messages: IntroItem[] = [
		{
			headline: 'Hi!',
			icon: '/assets/intro/wave.svg',
			text: 'lume is an app for sharing a digital Olympic Torch',
		},
	];
	get currentSlide() {
		return this.messages[this.currentIndex];
	}
	next() {
		if (this.currentIndex >= this.messages.length - 1) this.close();
		else this.currentIndex++;
	}
	prev() {
		if (this.currentIndex <= 0) this.close();
		else this.currentIndex--;
	}
	close() {
		console.log('close');
		this.toggleIntro.emit();
	}
}
