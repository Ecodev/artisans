import { Component, OnInit } from '@angular/core';
import { DoorService } from './services/door.service';
import { AbstractController } from '../shared/components/AbstractController';
import {AlertService} from '../shared/components/alert/alert.service';
import {UserService} from '../admin/users/services/user.service';
import {Literal} from '../shared/types';
import {catchError} from 'rxjs/internal/operators';
import {of, throwError} from 'rxjs';

@Component({
    selector: 'app-door',
    templateUrl: './door.component.html',
    styleUrls: ['./door.component.scss'],
})
export class DoorComponent extends AbstractController implements OnInit {

    public currentUser;

    constructor(public doorService: DoorService,
                private userService: UserService,
                private alertService: AlertService) {
        super();
    }

    public open(door: Literal) {
        this.doorService.open({door: door.id}).subscribe(
            res => {
                door.opened = true;
                this.alertService.info(res.message);
                setTimeout(() => door.opened = false, res.timer * 1000);
            },
            err => {
                this.alertService.error(err.message, 5000);
            }
        );
    }

    ngOnInit() {
        this.userService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
        });
    }

}
