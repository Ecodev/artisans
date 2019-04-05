import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { UserService } from '../services/user.service';
import {
    BookablesVariables,
    BookingFilter,
    BookingStatus,
    BookingType,
    CreateUser,
    CreateUserVariables,
    LogicalOperator,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserVariables,
} from '../../../shared/generated-types';
import { LicenseService } from '../../licenses/services/license.service';
import { UserTagService } from '../../userTags/services/userTag.service';
import { BookingService } from '../../bookings/services/booking.service';
import { AccountService } from '../../accounts/services/account.service';

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

    public runningSelfApproved;
    public runningActive;
    public pendingDemands;

    constructor(alertService: AlertService,
                userService: UserService,
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

        this.runningSelfApproved = this.getRunningSelfApprovedFilter();
        this.runningActive = this.getRunningActive();
        this.pendingDemands = this.getPendingApplicationsFilter();
    }

    /**
     * Sorties en cours
     */
    public getRunningSelfApprovedFilter(): BookingFilter {

        const filter: BookingFilter = {
            groups: [
                {
                    conditions: [
                        {
                            owner: {have: {values: [this.data.model.id]}},
                            status: {equal: {value: BookingStatus.booked}},
                            endDate: {null: {}},

                        },
                    ],
                    joins: {bookable: {conditions: [{bookingType: {in: {values: [BookingType.self_approved]}}}]}},
                },
            ],
        };

        return filter;
    }

    /**
     * Membership and inventory
     */
    public getRunningActive(): BookingFilter {

        const filter: BookingFilter = {
            groups: [
                {
                    conditions: [
                        {
                            owner: {have: {values: [this.data.model.id]}},
                            status: {equal: {value: BookingStatus.booked}},
                            endDate: {null: {}},
                        },
                    ],
                    joins: {bookable: {conditions: [{bookingType: {in: {values: [BookingType.admin_only, BookingType.mandatory]}}}]}},
                },
            ],
        };

        return filter;
    }

    /**
     * Demandes en attente
     */
    public getPendingApplicationsFilter(): BookingFilter {

        const filter: BookingFilter = {
            groups: [
                {
                    conditions: [
                        {
                            owner: {have: {values: [this.data.model.id]}},
                            status: {equal: {value: BookingStatus.application}},
                        },
                    ], joins: {bookable: {conditions: [{bookingType: {in: {values: [BookingType.admin_approved]}}}]}},
                },
            ],
        };
        return filter;
    }

    public getFamilyIds(): BookablesVariables {

        const familyBoss = this.data.model.owner || this.data.model;

        return {
            filter: {
                groups: [
                    {conditions: [{id: {equal: {value: familyBoss.id}}}]},
                    {
                        groupLogic: LogicalOperator.OR,
                        conditions: [{owner: {equal: {value: familyBoss.id}}}],
                    },
                ],
            },
        };
    }

}
