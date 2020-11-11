import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {NaturalAbstractController} from '@ecodev/natural';
import {filter, takeUntil} from 'rxjs/operators';

export interface Breadcrumb {
    link: any[] | string;
    label: string;
}

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent extends NaturalAbstractController implements OnInit {
    @HostBinding('class.mat-body') isBody = true;

    @Input() breadcrumbs: Breadcrumb[] = [];

    constructor(private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.update();
        this.router.events
            .pipe(
                takeUntil(this.ngUnsubscribe),
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe(() => this.update());
    }

    private update() {
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
