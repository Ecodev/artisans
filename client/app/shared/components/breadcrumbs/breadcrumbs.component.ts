import {Component, DestroyRef, HostBinding, inject, Input, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs/operators';
import {MatButtonModule} from '@angular/material/button';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export type Breadcrumb = {
    link: any[] | string;
    label: string;
};

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrl: './breadcrumbs.component.scss',
    imports: [MatButtonModule, RouterLink],
})
export class BreadcrumbsComponent implements OnInit {
    private readonly router = inject(Router);

    private readonly destroyRef = inject(DestroyRef);
    @HostBinding('class.mat-body') private isBody = true;

    @Input() public breadcrumbs: Breadcrumb[] = [];

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
        const breadcrumbs = this.getMergedBreadcrumbs(this.router.routerState.root.snapshot);
        this.breadcrumbs = breadcrumbs || [];
    }

    /**
     * Returns an object where with all route params through activated routes throw firstChild 'params'
     */
    public getMergedBreadcrumbs(route: ActivatedRouteSnapshot): Breadcrumb[] {
        if (route.firstChild) {
            return this.getMergedBreadcrumbs(route.firstChild);
        } else {
            return route.data.breadcrumbs || [];
        }
    }
}
