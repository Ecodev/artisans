import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalPersistenceService } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class PersistenceInUrlService extends NaturalPersistenceService {

    constructor(router: Router) {
        super(router);
    }

    /**
     * Override persist function to persist only in url
     */
    public persist(key: string, value: any, route: ActivatedRoute, storageKey: string): Promise<boolean> {
        return this.persistInUrl(key, value, route);
    }

}
