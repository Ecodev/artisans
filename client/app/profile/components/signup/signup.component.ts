import { Component, OnInit } from '@angular/core';
import { AbstractDetail } from '../../../admin/shared/components/AbstractDetail';
import {
    BookingInput,
    BookingStatus,
    CreateUserMutation,
    CreateUserMutationVariables,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserQuery,
    UserQueryVariables,
} from '../../../shared/generated-types';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserTagService } from '../../../admin/userTags/services/userTag.service';
import { LicenseService } from '../../../admin/licenses/services/license.service';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { AnonymousUserService, ConfirmPasswordStateMatcher } from './anonymous-user.service';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { LinkMutationService } from '../../../shared/services/link-mutation.service';
import { AppDataSource } from '../../../shared/services/data.source';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends AbstractDetail<UserQuery['user'],
    UserQueryVariables,
    CreateUserMutation['createUser'],
    CreateUserMutationVariables,
    UpdateUserMutation['updateUser'],
    UpdateUserMutationVariables,
    any> implements OnInit {

    public confirmPasswordStateMatcher = new ConfirmPasswordStateMatcher();
    private mandatoryBookables: AppDataSource;

    constructor(alertService: AlertService,
                private userService: AnonymousUserService,
                router: Router,
                route: ActivatedRoute,
                public userTagService: UserTagService,
                public licenseService: LicenseService,
                private bookingService: BookingService,
                private bookableService: BookableService,
                private linkService: LinkMutationService,
    ) {
        super('user', userService, alertService, router, route);
    }

    ngOnInit() {
        super.ngOnInit();

        this.bookableService.getMandatoryBookables().subscribe(bookables => {
            if (bookables) {
                this.mandatoryBookables = new AppDataSource(bookables);
            }
        });

    }

    public register() {
        this.create(false);
    }

    /**
     * TODO : replace by specific mutation
     */
    public postCreate(user) {

        this.userService.login({login: this.data.model.login, password: this.data.model.password}).subscribe(() => {

            (this.mandatoryBookables.data || []).forEach(bookable => {

                const newBooking: BookingInput = {
                    responsible: user,
                    startDate: (new Date()).toISOString(),
                    status: BookingStatus.booked,
                };

                this.bookingService.create(newBooking).subscribe(createdBooking => {
                    this.linkService.link(createdBooking, bookable).subscribe(result => {
                        this.router.navigateByUrl('/account');
                    });
                });

            });

        });

    }

}
