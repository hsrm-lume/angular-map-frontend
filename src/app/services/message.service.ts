import { Injectable } from '@angular/core';
//message interface with fixed variables
interface Message {
	title: string;
	text: string;
	type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	constructor() {}
	ms: Message[] = [];
	push(m: Message) {
		// reject duplicates
		if (this.ms.some((m2) => m2.title === m.title)) return;
		this.ms.push(m);
	}
	remove(m: Message) {
		this.ms.splice(this.ms.indexOf(m), 1);
	}
}
