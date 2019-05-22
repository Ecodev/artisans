import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractController, NaturalAlertService, NaturalSidenavContainerComponent, NaturalSidenavService } from '@ecodev/natural';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { UserService } from '../admin/users/services/user.service';
import { QrService } from '../shop/services/qr.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends NaturalAbstractController implements OnInit, OnDestroy {

    public menu: NaturalSidenavContainerComponent | undefined;

    /**
     * Model for header code search
     */
    public code = '';

    constructor(private userService: UserService,
                private router: Router,
                public route: ActivatedRoute,
                public qrService: QrService,
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

        this.qrService.scan().pipe(takeUntil(this.ngUnsubscribe), throttleTime(500)).subscribe(result => {
            const parsedCode = result.toLowerCase().replace('https://chez-emmy.ch/shop/product/', '');
            this.router.navigate(['/shop/product', parsedCode]);

        }, () => {
            const message = 'La caméra est indisponible, essaye de rechercher ton article au travers de son code';
            this.alertService.error(message, 5000);
            this.router.navigateByUrl('/');
        });
    }

    ngOnDestroy(): void {
        this.qrService.pause();
    }

    public goToCode() {
        this.router.navigate(['/shop/product', this.code]);
    }


}
