import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { clone } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class NaturalPersistenceService {

    constructor(private router: Router) {
    }

    /**
     * Persist in url and local storage the given value with the given key.
     * When stored in storage, we need more "key" to identify the controller.
     */
    public persist(key: string, value: any, route: ActivatedRoute, storageKey: string) {
        this.persistInUrl(key, value, route);
        this.persistInStorage(key, value, storageKey);
    }

    /**
     * Return object with persisted data in url or in session storage
     * Url has priority over session storage because of url sharing. When url is provided, session storage is ignored.
     * Url and storage are synced when arriving in a component :
     *  - When loading with url parameters, storage is updated to stay synced
     *  - When loading without url, but with storage data, the url is updated
     */
    public get(key: string, route: ActivatedRoute, storageKey: string): any {

        // From url
        let params = this.getFromUrl(key, route);
        if (!this.isFalseyValue(params)) {
            this.persistInStorage(key, params, storageKey);
            return params;
        }

        // From storage
        params = this.getFromStorage(key, storageKey);
        if (!this.isFalseyValue(params)) {
            this.persistInUrl(key, params, route);
            return params;
        }

        return null;
    }

    /**
     * Get given key from the url parameters
     */
    public getFromUrl(key: string, route: ActivatedRoute): any {
        const value = route.snapshot.paramMap.get(key);

        if (value) {
            return JSON.parse(value);
        }

        return null;
    }

    /**
     * Add/override given pair key-value in the url
     * Always JSON.stringify() the given value
     * If the value is falsey, the pair key-value is removed from the url.
     */
    public persistInUrl(key: string, value: any, route: ActivatedRoute) {
        const params = clone(route.snapshot.queryParams);

        if (this.isFalseyValue(value)) {
            delete params[key];
        } else {
            params[key] = JSON.stringify(value);
        }

        this.router.navigate(['.', params], {relativeTo: route});
    }

    /**
     *
     */
    public getFromStorage(key: string, storageKey: string): any {
        const value = sessionStorage.getItem(this.getStorageKey(key, storageKey));

        if (value) {
            return JSON.parse(value);
        }

        return null;
    }

    /**
     * Store value in session storage.
     * If value is falsey, the entry is removed
     */
    public persistInStorage(key: string, value: any, storageKey: string) {
        if (this.isFalseyValue(value)) {
            sessionStorage.removeItem(this.getStorageKey(key, storageKey));
        } else {
            sessionStorage.setItem(this.getStorageKey(key, storageKey), JSON.stringify(value));
        }
    }

    private getStorageKey(key, storageKey) {
        return storageKey + '-' + key;
    }

    // Returns if the given value is falsey
    // Falsey values are : null, undefined and empty string.
    // This cause usually the parameter to be removed from url/storage instead of being stored with no value. Url would be polluted.
    private isFalseyValue(value) {
        return value == null || value === ''; // == means null or undefined;
    }

}
