import { Injectable } from '@angular/core';
import { LayoutService } from './layout.service';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root',
})
export class IframeService {

	private slideRender: any;
	private iWindow: any;

	constructor(
		public layoutSvc: LayoutService,
		private storage: StorageService
	) { }

	public addEventListener() {
		window.addEventListener(
			'message',
			this.handleIframeEventListener.bind(this)
		);
	}

	public handleIframeEventListener(event) {
		// console.log(event);

		switch (event.data) {
			case 'shift+shift+/':
				this.layoutSvc.toggleMasthead();
				break;
			case 'ctrl+alt+l':
				this.layoutSvc.toggleSlideLabels();
				break;
			case 'ctrl+/':
				this.layoutSvc.toggleSidebar();
				break;
			case 'ctrl+alt+b':
				this.layoutSvc.toggleSlideToolbarClosed();
				break;
			case 'shift+f':
				this.layoutSvc.toggleFullscreen();
				break;
			case 'escape':
				if (this.storage.get('isFullscreen') === 'true') {
					this.layoutSvc.toggleFullscreen();
					return false;
				}
				break;
		}
	}

	private initIframe() {
		this.slideRender = document.getElementById('slideRender');
		if (!this.slideRender) {
			console.log('iframe undefined...');
			return;
		}

		this.iWindow = (this.slideRender as HTMLIFrameElement).contentWindow;
	}

	public navigate(path) {
		if (this.iWindow === undefined) {
			this.initIframe();
		}


		this.iWindow.postMessage({ route: path, type: 'navigation' }, '*');
	}

	public sendMessage(opt) {
		console.log('sending a message...');
		if (this.iWindow === undefined) {
			this.initIframe();
		}
		this.iWindow.postMessage(opt, '*');
	}
}
