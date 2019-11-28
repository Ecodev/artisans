import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../admin/users/services/user.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],

})
export class HomepageComponent implements OnInit {

    public title = 'Les artisans de la transition';

    public viewer;

    constructor(public userService: UserService, private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer.model;
    }

}
