import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NaturalAbstractController,
    NaturalAlertService,
    NaturalSidenavContainerComponent,
    NaturalSidenavService,
} from '@ecodev/natural';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../admin/users/services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends NaturalAbstractController implements OnInit {

    public menu: NaturalSidenavContainerComponent | undefined;

    /**
     * Model for header code search
     */
    public code = '';

    constructor(private userService: UserService,
                private router: Router,
                public route: ActivatedRoute,
                public alertService: NaturalAlertService,
    ) {
        super();
    }

    ngOnInit() {

        NaturalSidenavService.sideNavsChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            setTimeout(() => {
                this.menu = NaturalSidenavService.sideNavs.get('dashboardMenu') ||
                            NaturalSidenavService.sideNavs.get('adminMenu') ||
                            NaturalSidenavService.sideNavs.get('profileMenu');
            });
        });

    }

    public goToCode(): void {
        this.router.navigate(['/shop/product', this.code]).then(() => this.code = '');
    }

}
