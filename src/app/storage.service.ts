import { Injectable } from '@angular/core';
// import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor() { }
    set(key, value) {
        window.localStorage.setItem(key, value);
    }
    get(key) {
        return window.localStorage.getItem(key);
    }
}
