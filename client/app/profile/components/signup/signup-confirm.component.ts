import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { SignupComponent } from './signup.component';
import { NewUserService } from './new-user.service';

/**
 * The only usage of this component is to inject UserService with adapted validators
 */
@Component({
    selector: 'app-confirm',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignUpConfirmComponent extends SignupComponent implements OnInit {

    constructor(alertService: AlertService,
                userService: NewUserService,
                router: Router,
                route: ActivatedRoute,
                bookableService: BookableService,
    ) {
        super(userService, alertService, router, route, bookableService);
    }

}
