import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorService } from '../../../shared/components/error/error.service';
import { CategoryService } from './category.service';
import { CategoryResolve } from '../category';

@Injectable({
    providedIn: 'root',
})
export class CategoryResolver implements Resolve<CategoryResolve> {

    constructor(private categoryService: CategoryService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve category data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<CategoryResolve> {
        const observable = this.categoryService.resolve(route.params.categoryId);

        return this.errorService.redirectIfError(observable);
    }
}
