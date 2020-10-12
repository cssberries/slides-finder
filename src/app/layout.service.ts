import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    public idx = Math.floor(Math.random() * 1000);

    private _sidebarClosed: BehaviorSubject<boolean>;
    public sidebarClosed$: Observable<boolean>;

    private _slideLabelsHidden: BehaviorSubject<boolean>;
    public slideLabelsHidden$: Observable<boolean>;

    private _mastheadClosed: BehaviorSubject<boolean>;
    public mastheadClosed$: Observable<boolean>;

    private _slideToolbarClosed: BehaviorSubject<boolean>;
    public slideToolbarClosed$: Observable<boolean>;

    private _isFullscreen: BehaviorSubject<boolean>;
    public isFullscreen$: Observable<boolean>;

    constructor(private storage: StorageService) {
        this._slideLabelsHidden = new BehaviorSubject<boolean>
            ((this.storage.get('slideLabelsHidden') || 'false') === 'true' ? true : false);
        this.slideLabelsHidden$ = this._slideLabelsHidden.asObservable();

        this._sidebarClosed = new BehaviorSubject<boolean>
            ((this.storage.get('sidebarClosed') || 'false') === 'true' ? true : false);
        this.sidebarClosed$ = this._sidebarClosed.asObservable();

        this._mastheadClosed = new BehaviorSubject<boolean>
            ((this.storage.get('mastheadClosed') || 'false') === 'true' ? true : false);
        this.mastheadClosed$ = this._mastheadClosed.asObservable();

        this._slideToolbarClosed = new BehaviorSubject<boolean>
            ((this.storage.get('slideToolbarClosed') || 'false') === 'true' ? true : false);
        this.slideToolbarClosed$ = this._slideToolbarClosed.asObservable();

        this._isFullscreen = new BehaviorSubject<boolean>
            ((this.storage.get('isFullscreen') || 'false') === 'true' ? true : false);

        this._isFullscreen = new BehaviorSubject<boolean>
            ((this.storage.get('isFullscreen') || 'false') === 'true' ? true : false);
        this.isFullscreen$ = this._isFullscreen.asObservable();
    }

    toggleSlideLabels() {
        this._slideLabelsHidden.next(!this._slideLabelsHidden.value);
        this.storage.set('slideLabelsHidden', this._slideLabelsHidden.value.toString());
    }

    toggleSidebar() {
        this._sidebarClosed.next(!this._sidebarClosed.value);
        this.storage.set('sidebarClosed', this._sidebarClosed.value.toString());
    }

    toggleMasthead() {
        this._mastheadClosed.next(!this._mastheadClosed.value);
        this.storage.set('mastheadClosed', this._mastheadClosed.value.toString());
    }

    toggleSlideToolbarClosed() {
        this._slideToolbarClosed.next(!this._slideToolbarClosed.value);
        this.storage.set('mastheadClosed', this._slideToolbarClosed.value.toString());
    }

    toggleFullscreen() {
        this._isFullscreen.next(!this._isFullscreen.value);
        this.storage.set('isFullscreen', this._isFullscreen.value.toString());
    }
}
