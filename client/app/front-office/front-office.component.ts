import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAbstractController, NaturalAlertService } from '@ecodev/natural';

@Component({
    selector: 'app-front-office',
    templateUrl: './front-office.component.html',
    styleUrls: ['./front-office.component.scss'],
})
export class FrontOfficeComponent extends NaturalAbstractController implements OnInit {

    public searchTerm = '';
    public menuOpened = false;

    constructor(public route: ActivatedRoute,
                public alertService: NaturalAlertService,
    ) {
        super();
    }

    ngOnInit() {

    }

    public search() {

    }

}
