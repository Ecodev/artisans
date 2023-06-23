import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {NewsResolve} from '../news';
import {NewsService} from './news.service';

/**
 * Resolve product data for router
 */
export function resolveNews(route: ActivatedRouteSnapshot): Observable<NewsResolve> {
    const productService = inject(NewsService);
    const errorService = inject(ErrorService);

    const observable = productService.resolve(route.params.newsId).pipe(last());

    return errorService.redirectIfError(observable);
}
