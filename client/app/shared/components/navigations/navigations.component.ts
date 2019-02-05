import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    BookingSortingField,
    BookingsQuery,
    BookingsQueryVariables,
    BookingType,
    JoinType,
    LogicalOperator,
    SortingOrder,
    UsersQuery,
    UsersQueryVariables,
} from '../../generated-types';
import { AutoRefetchQueryRef } from '../../services/abstract-model.service';
import { QueryVariablesManager } from '../../classes/query-variables-manager';
import { mergeWith } from 'lodash';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-navigations',
    templateUrl: './navigations.component.html',
    styleUrls: ['./navigations.component.scss'],
    animations: [
        trigger('terminate', [
            transition(':leave', [
                animate('0.25s ease-in-out', style({transform: 'scale(0, 0)'})),
            ]),
        ]),
    ],
})
export class NavigationsComponent implements OnInit, OnDestroy {

    @Input() user;
    @Input() activeOnly = true;

    public bookings: BookingsQuery['bookings'];
    public bookingsQueryRef: AutoRefetchQueryRef<BookingsQuery['bookings']>;

    private bookingsQVM = new QueryVariablesManager<BookingsQueryVariables>();

    private currentPage = 0;
    private family;

    constructor(public userService: UserService, public bookingService: BookingService) {
    }

    ngOnInit() {

        const qvm = new QueryVariablesManager<UsersQueryVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{owner: {equal: {value: this.user.owner ? this.user.owner.id : this.user.id}}}]}]},
        });
        this.userService.getAll(qvm).subscribe(family => {
            this.family = [this.user, ...family.items];
            this.getNavigations(this.family).subscribe(bookings => this.bookings = bookings);
        });

    }

    ngOnDestroy() {
        if (this.bookingsQueryRef) {
            this.bookingsQueryRef.unsubscribe();
        }

    }

    public endBooking(booking) {
        this.bookingService.flagEndDate(booking.id).subscribe(() => {
            booking.endDate = new Date();
        });
    }

    public nextPage() {
        this.currentPage++;
        this.getNavigations(this.family).subscribe(bookings => {
            this.bookings.items.push(...bookings.items);
        });
    }

    public getNavigations(users: UsersQuery['users']['items']): Observable<BookingsQuery['bookings']> {

        const owner = {in: {values: users.map(u => u.id)}};
        const endDate = this.activeOnly ? {null: {}} : null;

        const variables: BookingsQueryVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                owner: owner,
                                endDate: endDate,
                            },
                        ],
                        joins: {
                            bookables: {
                                type: JoinType.leftJoin,
                                conditions: [{bookingType: {in: {values: [BookingType.self_approved]}}}],
                            },
                        },
                    },
                    {
                        groupLogic: LogicalOperator.OR,
                        conditions: [
                            {
                                owner: owner,
                                endDate: endDate,
                                bookables: {empty: {}},
                            },
                        ],
                    },
                ],
            },
            sorting: [
                {
                    field: BookingSortingField.endDate,
                    order: SortingOrder.ASC,
                },
            ],
        };

        this.bookingsQVM.set('variables', variables);
        this.bookingsQVM.set('pagination', {
            pagination: {
                pageSize: 10,
                pageIndex: this.currentPage,
            },
        });
        return this.bookingService.getAll(this.bookingsQVM);
    }

}
