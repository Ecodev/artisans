import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { UserService } from '../../../admin/users/services/user.service';
import { BankingInfosVariables, CurrentUserForProfile } from '../../../shared/generated-types';
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
        if (!this.viewer) {
            return;
        }

        const config: MatDialogConfig<BankingInfosVariables> = {
            data: {
                user: this.viewer.id,
            },
        };

        this.dialog.open(ProvisionComponent, config);
    }

}
