import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})

export class IframeService {
	constructor() {}
	public navigate(path) {
		const slideRender = document.getElementById('slideRender');
		if (!slideRender) {
			console.log('iframe undefined...');
			return;
		}

		const iWindow = ( slideRender as HTMLIFrameElement).contentWindow;

		iWindow.postMessage( { route: path, type: 'navigation'}, '*');
	}
}
