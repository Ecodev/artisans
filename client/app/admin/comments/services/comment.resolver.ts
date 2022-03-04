import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {CommentResolve} from '../comment';
import {CommentService} from './comment.service';

@Injectable({
    providedIn: 'root',
})
export class CommentResolver implements Resolve<CommentResolve> {
    public constructor(private readonly productService: CommentService, private readonly errorService: ErrorService) {}

    /**
     * Resolve product data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<CommentResolve> {
        const observable = this.productService.resolve(route.params.commentId);

        return this.errorService.redirectIfError(observable);
    }
}
