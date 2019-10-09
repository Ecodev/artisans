import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { UserService } from '../admin/users/services/user.service';

@Component({
    templateUrl: './front-end.component.html',
    styleUrls: ['./front-end.component.scss'],

})
export class FrontEndComponent implements OnInit {

    public title = 'Les artisans de la transition';

    public viewer;

    constructor(public userService: UserService,
                private route: ActivatedRoute,
                private alertService: NaturalAlertService) {
    }

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer.model;
    }

    public canAccessAdmin() {
        return UserService.canAccessAdmin(this.viewer);
    }

}
