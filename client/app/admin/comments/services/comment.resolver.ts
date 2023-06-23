import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {CommentResolve} from '../comment';
import {CommentService} from './comment.service';

/**
 * Resolve product data for router
 */
export function resolveComment(route: ActivatedRouteSnapshot): Observable<CommentResolve> {
    const productService = inject(CommentService);
    const errorService = inject(ErrorService);
    const observable = productService.resolve(route.params.commentId).pipe(last());

    return errorService.redirectIfError(observable);
}
