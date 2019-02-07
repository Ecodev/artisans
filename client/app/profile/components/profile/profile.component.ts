import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { AccountService } from '../../../admin/accounts/services/account.service';
import { mergeWith } from 'lodash';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { UserService } from '../../../admin/users/services/user.service';

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

}
