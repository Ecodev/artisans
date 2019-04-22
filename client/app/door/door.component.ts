import { Component, OnInit } from '@angular/core';
import { DoorService } from './services/door.service';
import { NaturalAbstractController } from '@ecodev/natural';
import { UserService } from '../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Literal } from '@ecodev/natural';
import { NaturalAlertService } from '@ecodev/natural';


@Component({
    selector: 'app-door',
    templateUrl: './door.component.html',
    styleUrls: ['./door.component.scss'],
})
export class DoorComponent extends NaturalAbstractController implements OnInit {

    public viewer;

    constructor(public doorService: DoorService,
                private userService: UserService,
                private alertService: NaturalAlertService,
                private route: ActivatedRoute) {
        super();
    }

    public open(door: Literal) {
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

    ngOnInit() {
        this.viewer = this.route.snapshot.data.viewer.model;
    }

}
