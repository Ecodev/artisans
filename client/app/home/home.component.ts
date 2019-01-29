import { Component, OnInit } from '@angular/core';
import { UserService } from '../admin/users/services/user.service';
import { SidenavService } from '../shared/modules/sidenav/sidenav.service';
import { SidenavContainerComponent } from '../shared/modules/sidenav/components/sidenav-container/sidenav-container.component';
import { AbstractController } from '../shared/components/AbstractController';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends AbstractController implements OnInit {

    public menu: SidenavContainerComponent | undefined;

    /**
     * Model for header code search
     */
    public code;

    constructor(public userService: UserService, private router: Router) {
        super();
    }

    ngOnInit() {

        SidenavService.sideNavsChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            setTimeout(() => {
                this.menu = SidenavService.sideNavs.get('adminMenu');
            });
        });
    }

    public goToCode() {
        this.router.navigate(['/booking', this.code]);
    }

}
