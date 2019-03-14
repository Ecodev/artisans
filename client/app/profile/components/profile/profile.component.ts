import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { AccountService } from '../../../admin/accounts/services/account.service';
import { mergeWith } from 'lodash';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { UserService } from '../../../admin/users/services/user.service';
import * as Datatrans from '../../../datatrans-2.0.0.sandbox.min.js';

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
                public accountService: AccountService) {
    }

    ngOnInit() {
        this.user = this.route.snapshot.data.user.model;
    }

    public pay() {
        Datatrans.startPayment({
            params: {
                production: false,
                merchantId: '1100003518',
                sign: '190314170627759807',
                refno: '1123',
                amount: '100',
                currency: 'CHF',
                uppReturnTarget: '_self'
            },
            onLoaded: (args) => console.log('datatrans loaded event', args),
            onOpened: (args) => console.log('datatrans opened event', args),
            onCancelled: (args) => console.warn('datatrans canceled event', args),
            onError: (args) => console.error('datatrans error event', args),
        });
    }

}
