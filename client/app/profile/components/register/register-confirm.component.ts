import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { RegisterComponent } from './register.component';
import { NewUserService } from './new-user.service';
import { Apollo } from 'apollo-angular';

/**
 * The only usage of this component is to inject UserService with adapted validators
 */
@Component({
    selector: 'app-confirm',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterConfirmComponent extends RegisterComponent implements OnInit {

    constructor(alertService: AlertService,
                userService: NewUserService,
                router: Router,
                route: ActivatedRoute,
                bookableService: BookableService,
                apollo: Apollo,
    ) {
        super(userService, alertService, router, route, bookableService, apollo);
    }

}
