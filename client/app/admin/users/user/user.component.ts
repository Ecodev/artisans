import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { UserService } from '../services/user.service';
import {
    BookingFilter,
    BookingStatus,
    BookingType,
    CreateUser,
    CreateUserVariables,
    LogicalOperator,
    UpdateUser,
    UpdateUserVariables,
    User,
    UsersVariables,
    UserVariables,
} from '../../../shared/generated-types';
import { LicenseService } from '../../licenses/services/license.service';
import { UserTagService } from '../../userTags/services/userTag.service';
import { BookingService } from '../../bookings/services/booking.service';
import { AccountService } from '../../accounts/services/account.service';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent
    extends AbstractDetail<User['user'],
        UserVariables,
        CreateUser['createUser'],
        CreateUserVariables,
        UpdateUser['updateUser'],
        UpdateUserVariables,
        any> implements OnInit {

    public showFamilyTab;
    public UserService = UserService;

    constructor(alertService: AlertService,
                private userService: UserService,
                router: Router,
                route: ActivatedRoute,
                public userTagService: UserTagService,
                public licenseService: LicenseService,
                public bookingService: BookingService,
                public accountService: AccountService,
    ) {
        super('user', userService, alertService, router, route);
    }

    ngOnInit() {
        super.ngOnInit();

        this.route.data.subscribe(() => {

            const qvm = new QueryVariablesManager<UsersVariables>();
            qvm.set('variables', UserService.getFamilyVariables(this.data.model));
            this.userService.getAll(qvm).subscribe(family => {
                this.showFamilyTab = family.length > 1;
            });

        });

    }

}
