import { Injectable } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { FormValidators, Literal } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class AnonymousUserService extends UserService {

    constructor(apollo: Apollo,
                router: Router,
                permissionsService: PermissionsService,
    ) {
        super(apollo, router, permissionsService);
    }

    protected getDefaultForClient(): Literal {
        return {
            hasInsurance: false,
            termsAgreement: false,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            email: [Validators.required, Validators.email],
            hasInsurance: [],
            termsAgreement: [],
        };
    }
}
