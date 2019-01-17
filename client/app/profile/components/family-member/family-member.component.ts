import { Component, Input, OnInit } from '@angular/core';
import {
    CreateUserMutation,
    CreateUserMutationVariables,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserQuery,
    UserQueryVariables,
} from '../../../shared/generated-types';
import { AbstractDetail } from '../../../admin/shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'lodash';
import { FamilyUserService } from './family-user.service';

@Component({
    selector: 'app-family-member',
    templateUrl: './family-member.component.html',
    styleUrls: ['./family-member.component.scss'],
})
export class FamilyMemberComponent
    extends AbstractDetail<UserQuery['user'],
        UserQueryVariables,
        CreateUserMutation['createUser'],
        CreateUserMutationVariables,
        UpdateUserMutation['updateUser'],
        UpdateUserMutationVariables,
        any> implements OnInit {

    @Input() user: UserQuery['user'];

    constructor(alertService: AlertService,
                userService: FamilyUserService,
                router: Router,
                route: ActivatedRoute,
    ) {
        super('user', userService, alertService, router, route);
    }

    /**
     * Replace resolved data from router by input and server query
     */
    ngOnInit() {

        if (this.user && this.user.id) {
            this.service.getOne(this.user.id).subscribe(user => {
                this.data = merge({model: this.service.getEmptyObject()}, {model: user});
                this.initForm();
            });
        } else {
            this.data = {model: this.service.getEmptyObject()};
            this.initForm();
        }

    }

}
