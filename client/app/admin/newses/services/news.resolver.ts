import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {NewsService} from './news.service';

/**
 * Resolve product data for router
 */
export function resolveNews(route: ActivatedRouteSnapshot): ReturnType<NewsService['resolve']> {
    const productService = inject(NewsService);
    const errorService = inject(ErrorService);

    const observable = productService.resolve(route.params.newsId).pipe(last());

    return errorService.redirectIfError(observable);
}
