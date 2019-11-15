import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import {
    CreateUser,
    CreateUserVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserVariables,
} from '../../../shared/generated-types';
import { UserTagService } from '../../user-tags/services/user-tag.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent
    extends NaturalAbstractDetail<User['user'],
        UserVariables,
        CreateUser['createUser'],
        CreateUserVariables,
        UpdateUser['updateUser'],
        UpdateUserVariables,
        any> implements OnInit {

    public UserService = UserService;

    public nextCodeAvailable: number;

    constructor(private userService: UserService,
                injector: Injector,
                public userTagService: UserTagService,
    ) {
        super('user', userService, injector);
    }

    ngOnInit() {
        super.ngOnInit();

        this.userService.getNextCodeAvailable().subscribe(code => {
            this.nextCodeAvailable = code;
        });

    }

}
