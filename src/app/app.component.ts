import { Component, OnInit } from '@angular/core';
import { StorageService } from './storage.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
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
	public theme = 'mf--light';
	public mastheadClosed: boolean;
	public isFullscreen: boolean;

	isProduction = environment.production;
	subscription: Subscription;
	constructor(
		private storage: StorageService,
		private _hotkeysService: HotkeysService,
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

		this._hotkeysService.add(
			new Hotkey('ctrl+shift+/', (event: KeyboardEvent): boolean => {
				this.layoutSvc.toggleMasthead();
				return false;
			})
		);

		this._hotkeysService.add(
			new Hotkey('ctrl+alt+l', (event: KeyboardEvent): boolean => {
				this.layoutSvc.toggleSlideLabels();
				return false;
			})
		);

		this._hotkeysService.add(
			new Hotkey('ctrl+/', (event: KeyboardEvent): boolean => {
				this.layoutSvc.toggleSidebar();
				return false;
			})
		);

		this._hotkeysService.add(
			new Hotkey('ctrl+alt+b', (event: KeyboardEvent): boolean => {
				this.layoutSvc.toggleSlideToolbarClosed();
				return false;
			})
		);

		this._hotkeysService.add(
			new Hotkey('shift+f', (event: KeyboardEvent): boolean => {
				this.layoutSvc.toggleFullscreen();
				return false;
			})
		);

		this._hotkeysService.add(
			new Hotkey('escape', (event: KeyboardEvent): boolean => {
				if (this.storage.get('isFullscreen') === 'true') {
					this.layoutSvc.toggleFullscreen();
					return false;
				}
			})
		);
	}

	public setTheme(theme: any) {
		this.theme = theme;
		document.firstElementChild.setAttribute('class', theme);
		this.storage.set('theme', this.theme);
	}
	public gitStatus() {
		this.SlidesSvs.gitStatus();
	}

	ngOnInit() {
		this.setTheme(this.theme);
	}
}
