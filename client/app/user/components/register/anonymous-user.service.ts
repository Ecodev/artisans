import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormValidators, Literal } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { UserService } from '../../../admin/users/services/user.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

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

    public getFormValidators(): FormValidators {
        return {
            email: [Validators.required, Validators.email],
            // termsAgreement: [], // todo : restore ?
        };
    }

    protected getDefaultForClient(): Literal {
        return {
            // termsAgreement: false, // todo : restore ?
        };
    }
}
