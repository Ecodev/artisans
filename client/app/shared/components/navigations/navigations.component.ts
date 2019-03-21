import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { animate, style, transition, trigger } from '@angular/animations';
import {
    BookingPartialInput,
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
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { CommentComponent } from './comment.component';
import { AlertService } from '../alert/alert.service';

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
    @Input() showEmptyMessage = false;

    public bookings: BookingsQuery['bookings'];
    public bookingsQueryRef: AutoRefetchQueryRef<BookingsQuery['bookings']>;

    private bookingsQVM = new QueryVariablesManager<BookingsQueryVariables>();

    private currentPage = 0;
    private family;

    constructor(public userService: UserService,
                public bookingService: BookingService,
                private alertService: AlertService,
                private dialog: MatDialog,
                private snackbar: MatSnackBar) {
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

        const snackbarOptions: MatSnackBarConfig = {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 6000,
        };

        const modalOptions = {
            data: {
                title: 'Commentaire de fin de sortie',
                message: '',
                cancelText: 'Annuler',
                confirmText: 'Valider',
            },
        };

        this.bookingService.flagEndDate(booking.id).subscribe(() => {
            booking.endDate = new Date();
            this.snackbar.open('La sortie est terminée', 'Faire un commentaire', snackbarOptions).onAction().subscribe(() => {

                this.dialog.open(CommentComponent, modalOptions).afterClosed().subscribe(comment => {
                    if (comment && comment !== '') {
                        booking.endComment = comment;
                        const partialBooking = {id: booking.id, endComment: comment} as BookingPartialInput;
                        this.bookingService.updatePartially(partialBooking).subscribe((res) => {
                            this.alertService.info('Merci pour votre commentaire');
                        });
                    }

                });
            });
        });
    }

    public update(partialBooking) {
        this.bookingService.updatePartially(partialBooking).subscribe(booking => {
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
                    order: SortingOrder.DESC,
                    nullAsHighest: true,
                },
                {
                    field: BookingSortingField.endDate,
                    order: SortingOrder.DESC,
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
        return this.bookingService.getAll(this.bookingsQVM, true);
    }

}
