import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { UserService } from '../services/user.service';
import {
    BookingStatus,
    CreateUserMutation,
    CreateUserMutationVariables,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserQuery,
    UserQueryVariables,
} from '../../../shared/generated-types';
import { BookingService } from '../../../booking/services/booking.service';
import { LicenseService } from '../../licenses/services/license.service';
import { UserTagService } from '../../userTags/services/userTag.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent
    extends AbstractDetail<UserQuery['user'],
        UserQueryVariables,
        CreateUserMutation['createUser'],
        CreateUserMutationVariables,
        UpdateUserMutation['updateUser'],
        UpdateUserMutationVariables,
        any> {

    public bookingStatus = BookingStatus;

    constructor(alertService: AlertService,
                userService: UserService,
                router: Router,
                route: ActivatedRoute,
                public userTagService: UserTagService,
                public licenseService: LicenseService,
                public bookingService: BookingService,
    ) {
        super('user', userService, alertService, router, route);
    }
}
