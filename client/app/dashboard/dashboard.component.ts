import { Component, OnInit } from '@angular/core';
import { UserService } from '../admin/users/services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

    public title = 'my-ichtus';

    public currentUser;

    constructor(public userService: UserService) {
    }

    public ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => this.currentUser = user);
    }

    public canAccessAdmin() {
        return UserService.canAccessAdmin(this.currentUser);
    }

}
