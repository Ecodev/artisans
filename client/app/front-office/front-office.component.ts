import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAbstractController, NaturalAlertService } from '@ecodev/natural';
import { CurrentUserForProfile_viewer, UserRole } from '../shared/generated-types';

@Component({
    selector: 'app-front-office',
    templateUrl: './front-office.component.html',
    styleUrls: ['./front-office.component.scss'],
})
export class FrontOfficeComponent extends NaturalAbstractController implements OnInit {

    public searchTerm = '';
    public menuOpened = false;

    public UserRole = UserRole;
    public viewer: CurrentUserForProfile_viewer;

    constructor(public route: ActivatedRoute,
                public alertService: NaturalAlertService,
    ) {
        super();
    }

    ngOnInit() {
        this.viewer = this.route.snapshot.data.viewer.model;
    }

    public search() {

    }

}
