import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormValidators, Literal } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { LoginValidatorFn } from '../../../admin/users/services/user.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { AnonymousUserService } from './anonymous-user.service';

@Injectable({
    providedIn: 'root',
})
export class NewUserService extends AnonymousUserService {

    constructor(apollo: Apollo, router: Router, permissionsService: PermissionsService) {
        super(apollo, router, permissionsService);
    }

    public getFormValidators(): FormValidators {
        return {
            login: [Validators.required, LoginValidatorFn],
            firstName: [Validators.required, Validators.maxLength(100)],
            lastName: [Validators.required, Validators.maxLength(100)],
            email: [Validators.required, Validators.email],
            locality: [Validators.required],
            street: [Validators.required],
            postcode: [Validators.required],
            country: [Validators.required],
        };
    }

    protected getDefaultForClient(): Literal {
        return {
            password: '',
        };
    }
}
