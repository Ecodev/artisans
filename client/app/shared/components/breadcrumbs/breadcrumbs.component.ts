import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs/operators';
import {MatButton} from '@angular/material/button';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export type Breadcrumb = {
    link: any[] | string;
    label: string;
};

@Component({
    selector: 'app-breadcrumbs',
    imports: [MatButton, RouterLink],
    templateUrl: './breadcrumbs.component.html',
    styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    protected breadcrumbs: Breadcrumb[] = [];

    public ngOnInit(): void {
        this.update();
        this.router.events
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe(() => this.update());
    }

    private update(): void {
        this.breadcrumbs = this.getMergedBreadcrumbs(this.router.routerState.root.snapshot);
    }

    /**
     * Returns an object where with all route params through activated routes throw firstChild 'params'
     */
    private getMergedBreadcrumbs(route: ActivatedRouteSnapshot): Breadcrumb[] {
        if (route.firstChild) {
            return this.getMergedBreadcrumbs(route.firstChild);
        } else {
            return route.data.breadcrumbs || [];
        }
    }
}
