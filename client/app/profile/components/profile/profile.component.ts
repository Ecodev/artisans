import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { UserService } from '../../../admin/users/services/user.service';
import { CurrentUserForProfile } from '../../../shared/generated-types';
import { ConfigService } from '../../../shared/services/config.service';
import { ProvisionComponent } from '../provision/provision.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

    public viewer: CurrentUserForProfile['viewer'];

    constructor(public userService: UserService,
                private alertService: NaturalAlertService,
                private route: ActivatedRoute,
                private apollo: Apollo,
                private dialog: MatDialog,
    ) {
    }

    ngOnInit() {
        this.viewer = this.route.snapshot.data.viewer.model;
    }

    public pay(): void {
        if (!this.viewer || !this.viewer.account) {
            return;
        }

        const config: MatDialogConfig = {
            data: {
                balance: Number(this.viewer.account.balance),
                user: this.viewer,
            },
        };

        this.dialog.open(ProvisionComponent, config);
    }

}
