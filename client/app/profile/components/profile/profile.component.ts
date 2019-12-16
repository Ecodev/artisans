import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { UserService } from '../../../admin/users/services/user.service';
import { CurrentUserForProfile } from '../../../shared/generated-types';

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
    ) {
    }

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer.model;
    }

}
