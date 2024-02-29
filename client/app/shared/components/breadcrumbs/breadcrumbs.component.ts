import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink} from '@angular/router';
import {NaturalAbstractController} from '@ecodev/natural';
import {filter, takeUntil} from 'rxjs/operators';
import {MatButtonModule} from '@angular/material/button';

export type Breadcrumb = {
    link: any[] | string;
    label: string;
};

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
    standalone: true,
    imports: [MatButtonModule, RouterLink],
})
export class BreadcrumbsComponent extends NaturalAbstractController implements OnInit {
    @HostBinding('class.mat-body') private isBody = true;

    @Input() public breadcrumbs: Breadcrumb[] = [];

    public constructor(private readonly router: Router) {
        super();
    }

    public ngOnInit(): void {
        this.update();
        this.router.events
            .pipe(
                takeUntil(this.ngUnsubscribe),
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
