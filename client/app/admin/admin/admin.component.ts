import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAbstractController} from '@ecodev/natural';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent extends NaturalAbstractController implements OnInit {
    public viewer;

    constructor(private route: ActivatedRoute) {
        super();
    }

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer ? this.route.snapshot.data.viewer.model : null;
    }
}
