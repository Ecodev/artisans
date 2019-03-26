import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { mergeWith } from 'lodash';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { UserService } from '../../../admin/users/services/user.service';
import * as Datatrans from '../../../datatrans-2.0.0.sandbox.js';
import { MatDialog } from '@angular/material';
import { ProvisionComponent } from '../provision/provision.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

    public user;

    constructor(public userService: UserService,
                private alertService: AlertService,
                private route: ActivatedRoute,
                public bookableService: BookableService,
                private dialog: MatDialog) {
    }

    ngOnInit() {
        this.user = this.route.snapshot.data.user.model;
    }

    public pay() {
        const user = this.userService.getCachedCurrentUser();
        if (user !== null) {
            this.dialog.open(ProvisionComponent).afterClosed().subscribe(amount => {
                if (amount) {
                    this.doPayment(user, amount);
                }
            });
        }
    }

    private doPayment(user, amount): void {
        Datatrans.startPayment({
            params: {
                production: false,
                merchantId: '1100003518',
                sign: '190314170627759807',
                refno: user.id,
                amount: amount * 100,
                currency: 'CHF',
            },
            success: () => {
                this.alertService.info('Paiement réussi');
                // Request user to update account.
                // Don't call accountService as actual user may not have one, and it couldn't be updated.
                this.userService.getOne(user.id, true).subscribe(updatedUser => {
                    user.account = updatedUser.account;
                });
            },
            error: (data) => {
                this.alertService.error('Le paiement n\'a pas abouti: ' + data.message);
            },
            cancel: () => {
                this.alertService.error('Le paiement a été annulé');
            },
        });
    }

}
