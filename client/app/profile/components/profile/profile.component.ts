import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    BookingsQuery,
    BookingType,
    CreateUserMutation,
    CreateUserMutationVariables,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserQuery,
    UserQueryVariables,
    UserRole,
} from '../../../shared/generated-types';
import { AbstractDetail } from '../../../admin/shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../admin/users/services/user.service';
import { AppDataSource } from '../../../shared/services/data.source';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { AutoRefetchQueryRef } from '../../../shared/services/abstract-model.service';
import { AccountService } from '../../../admin/accounts/services/account.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends AbstractDetail<UserQuery['user'],
    UserQueryVariables,
    CreateUserMutation['createUser'],
    CreateUserMutationVariables,
    UpdateUserMutation['updateUser'],
    UpdateUserMutationVariables,
    any> implements OnInit, OnDestroy {

    public BookableService = BookableService; // template usage
    public runningServicesDS: AppDataSource;
    public pendingApplicationsDS: AppDataSource;

    public runningServices: AutoRefetchQueryRef<BookingsQuery['bookings']>;
    public pendingApplications: AutoRefetchQueryRef<BookingsQuery['bookings']>;

    public servicesColumns = ['name', 'periodicPrice', 'revoke'];
    public applicationsColumns = ['name', 'initialPrice', 'periodicPrice', 'cancel'];

    constructor(private userService: UserService,
                alertService: AlertService,
                router: Router,
                route: ActivatedRoute,
                private bookingService: BookingService,
                public bookableService: BookableService,
                public accountService: AccountService) {

        super('user', userService, alertService, router, route);
    }

    ngOnInit() {
        super.ngOnInit();

        this.runningServices = this.userService.getRunningServices(this.data.model);
        this.pendingApplications = this.userService.getPendingApplications(this.data.model);

        this.runningServicesDS = new AppDataSource(this.runningServices.valueChanges);
        this.pendingApplicationsDS = new AppDataSource(this.pendingApplications.valueChanges);

        const account = this.form.get('account');
        const formState = {
            value: account && account.value ? account.value.iban : null,
            disabled: account && account.value && !!account.value.iban,
        };

        this.form.addControl('iban', new FormControl(formState));

    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.runningServices.unsubscribe();
        this.pendingApplications.unsubscribe();
    }

    public addApplication(bookable) {
        this.bookingService.createWithBookable(bookable, this.data.model).subscribe((newBooking) => {
        });
    }

    /**
     * Set end date ?
     */
    public revokeBooking(booking) {
        this.bookingService.flagEndDate(booking.id);
    }

    public canRevoke(booking): boolean {
        return booking.bookables[0].bookingType !== BookingType.mandatory;
    }

    public cancelApplication(booking) {
        this.bookingService.delete([booking]);
    }

    /**
     * Manages account transparently just by setting the iban.
     * If no account exists when an iban is created, then the account is created for current user and setted iban
     * If account exists and iban changes, the account is updated
     * TODO : test after fixing server error
     */
    public updateOrCreateAccount() {
        const iban = this.form.get('iban');
        const account = this.form.get('account');

        const confirmAndLock = () => {
            this.alertService.info('Votre compte IBAN a été mis à jour');

            if (iban) {
                iban.disable();
            }
        };

        if (iban && iban.value && account && account.value) {
            const newAccount = {id: account.value.id, iban: iban.value};
            this.accountService.updateNow(newAccount).subscribe(confirmAndLock);
        } else if (iban && iban.value && account && !account.value) {
            this.accountService.create({
                iban: iban.value,
                owner: this.data.model.id,
                name: 'User account',
            }).subscribe(confirmAndLock);
        }
    }

    public unlockIBAN() {
        const iban = this.form.get('iban');

        if (iban) {
            iban.enable();
        }
    }

    public showBecomeMember() {
        const isMember = [UserRole.member, UserRole.responsible, UserRole.administrator].indexOf(this.data.model.role) > -1;
        const isOwner = !this.data.model.owner;

        return !isMember && !isOwner;
    }

    public canLeave() {
        return !!this.data.model.owner;
    }

    public unregister(): void {
        this.alertService.confirm('Démission', 'Voulez-vous quitter le club Ichtus ?', 'Démissioner définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.userService.unregister(this.data.model).subscribe(() => {
                        const message = 'Vous avez démissioné avec succès';
                        this.alertService.info(message, 5000);
                        this.userService.logout();
                    });
                }
            });
    }
}
