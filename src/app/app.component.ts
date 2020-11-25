import { Component, HostListener, OnInit } from '@angular/core';
import { StorageService } from './storage.service';
// import { HotkeysService, Hotkey } from 'cssberries-angular2-hotkeys';
import { SlidesService } from './slides/slides.service';
import { environment } from 'src/environments/environment';
import { LayoutService } from './layout.service';
import { fromEvent, Subscription } from 'rxjs';
import { IframeService } from './iframe.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

	@HostListener('document:keydown.shift.f') toggleFullscreen(event: KeyboardEvent) {
		this.layoutSvc.toggleFullscreen();
	}

	public theme = 'mf--light';
	public mastheadClosed: boolean;
	public isFullscreen: boolean;

	isProduction = environment.production;
	subscription: Subscription;
	constructor(
		private storage: StorageService,
		public layoutSvc: LayoutService,
		public iframeSvc: IframeService,
		private SlidesSvs: SlidesService
	) {
		this.iframeSvc.addEventListener();
		this.theme = this.storage.get('theme') || 'mf--light';
		this.layoutSvc.mastheadClosed$.subscribe(
			(val) => (this.mastheadClosed = val)
		);
		this.layoutSvc.isFullscreen$.subscribe(
			(val) => (this.isFullscreen = val)
		);
	}

	public setTheme(theme: any) {
		this.theme = theme;
		document.firstElementChild.setAttribute('class', theme);
		this.storage.set('theme', this.theme);
		// this.iframeSvc.sendMessage({ type: 'theme' });
	}
	public gitStatus() {
		this.SlidesSvs.gitStatus();
	}

	ngOnInit() {
		this.setTheme(this.theme);
	}
}
