import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ResourceResolve } from '../resource';
import { ErrorService } from '../../../shared/components/error/error.service';
import { ResourceService } from '../services/resource.service';

@Injectable({
    providedIn: 'root',
})
export class ResourceResolver implements Resolve<ResourceResolve> {

    constructor(private resourceService: ResourceService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve resource data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<ResourceResolve> {
        const observable = this.resourceService.resolve(route.params.resourceId);

        return this.errorService.redirectIfError(observable);
    }
}
