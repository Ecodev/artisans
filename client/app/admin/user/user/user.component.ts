import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { UserService } from '../services/user.service';
import {
    CreateUserMutation,
    CreateUserMutationVariables,
    UserQuery,
    UserQueryVariables,
    UpdateUserMutation,
    UpdateUserMutationVariables,
} from '../../../shared/generated-types';
import { TagService } from '../../tags/services/tag.service';
import { BookingService } from '../../../booking/services/booking.service';

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

    constructor(alertService: AlertService,
                userService: UserService,
                router: Router,
                route: ActivatedRoute,
                public tagService: TagService,
                public bookingService: BookingService
    ) {
        super('user', userService, alertService, router, route);
    }
}
