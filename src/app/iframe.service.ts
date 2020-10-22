   import { Injectable } from '@angular/core';
import { LayoutService } from './layout.service';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root',
})
export class IframeService {
	constructor(
		public layoutSvc: LayoutService,
		private storage: StorageService
	) {}

	public addEventListener() {
		window.addEventListener(
			'message',
			this.handleIframeEventListener.bind(this)
		);
	}

	public handleIframeEventListener(event) {
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

	public navigate(path) {
		const slideRender = document.getElementById('slideRender');
		if (!slideRender) {
			console.log('iframe undefined...');
			return;
		}

		const iWindow = (slideRender as HTMLIFrameElement).contentWindow;

		iWindow.postMessage({ route: path, type: 'navigation' }, '*');
	}
}
