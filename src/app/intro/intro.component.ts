import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

interface IntroItem {
	title: string;
	image: string;
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
			title: 'Hi!',
			image: 'wave.svg',
			text: 'lume is an app for sharing a digital Olympic Torch',
		},
		{
			title: 'the torch',
			image: 'torchFlame.svg',
			text: 'Every user with the lume app has a torch, that can be lit through interacting with an other lume device having its flame turned on.',
		},
		{
			title: 'receiving a torch',
			image: 'shareFlame.svg',
			text: 'There are two ways of interaction.\nYou may just hold two android phones together, and the flame will be passed',
		},
		{
			title: 'using your camera',
			image: 'shareCamera.svg',
			text: 'Or use your camera and scan a lume QR code.\nYour torch will be lit in no time',
		},
		{
			title: 'sharing your flame',
			image: 'shareFlameFlipped.svg',
			text: "Sharing is as simple as receiving a flame, just hold two android phones together and your phone will share it's flame with the recipient",
		},
		{
			title: 'sharing your flame',
			image: 'shareQr.svg',
			text: 'Alternatively press the QR code button to share your fire with another person',
		},
		{
			title: 'Are you hungry for more?',
			image: 'map.svg',
			text: 'View lume torch stats with this map view.\nHow many times has it been passed on?\n Where has the torch gone?\nHave fun exploring the map!',
		},
		{
			title: 'Be a part of lume!',
			image: 'torchFlame.svg',
			text: 'To become part of the lume network, just download the app to recieve and spread the fire!',
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
	downloadAndroid() {
		window.location.href = environment.appDownloadUrlAndroid;
	}
	downloadIos() {
		window.location.href = environment.appDownloadUrlIos;
	}
}
