import { Component, OnInit } from '@angular/core';
import { UserService } from '../admin/user/services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

    constructor(public userService: UserService) {
    }

    ngOnInit() {

    }

}
