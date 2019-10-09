import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../users/services/user.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {

    public viewer;

    constructor(private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.viewer = this.route.snapshot.data.viewer.model;
    }
}
