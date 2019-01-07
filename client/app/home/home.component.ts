import { Component, OnInit } from '@angular/core';
import { UserService } from '../admin/users/services/user.service';
import { SidenavService } from '../shared/modules/sidenav/sidenav.service';
import { SidenavContainerComponent } from '../shared/modules/sidenav/components/sidenav-container/sidenav-container.component';
import { AbstractController } from '../shared/components/AbstractController';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends AbstractController implements OnInit {

    public menu: SidenavContainerComponent | undefined;

    constructor(public userService: UserService) {
        super();
    }

    ngOnInit() {

        SidenavService.sideNavsChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            setTimeout(() => {
                this.menu = SidenavService.sideNavs.get('adminMenu');
            });
        });
    }

}
