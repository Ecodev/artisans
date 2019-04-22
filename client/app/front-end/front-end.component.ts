import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { UserService } from '../admin/users/services/user.service';
import { DoorService } from '../door/services/door.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './front-end.component.html',
    styleUrls: ['./front-end.component.scss'],

})
export class FrontEndComponent implements OnInit {

    public title = 'chez-emmy';

    public viewer;

    constructor(public userService: UserService,
                private route: ActivatedRoute,
                public doorService: DoorService,
                private alertService: NaturalAlertService) {
    }

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer.model;
    }

    public canAccessAdmin() {
        return UserService.canAccessAdmin(this.viewer);
    }

    public canAccessDoor() {
        return UserService.canAccessDoor(this.viewer);
    }

    public openDoor() {
        const door = this.doorService.doors[0];
        this.doorService.open().subscribe(
            res => {
                door.opened = true;
                this.alertService.info(res.message);
                setTimeout(() => door.opened = false, res.timer * 1000);
            },
            err => {
                this.alertService.error(err.message, 5000);
            },
        );
    }

}
