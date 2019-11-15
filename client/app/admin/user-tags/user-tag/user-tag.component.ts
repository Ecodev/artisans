import { Component, Injector } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import {
    CreateUserTag,
    CreateUserTagVariables,
    DeleteUserTags,
    UpdateUserTag,
    UpdateUserTagVariables,
    UserTag,
    UserTagVariables,
} from '../../../shared/generated-types';
import { UserService } from '../../users/services/user.service';
import { UserTagService } from '../services/user-tag.service';

@Component({
    selector: 'app-user-tag',
    templateUrl: './user-tag.component.html',
    styleUrls: ['./user-tag.component.scss'],
})
export class UserTagComponent
    extends NaturalAbstractDetail<UserTag['userTag'],
        UserTagVariables,
        CreateUserTag['createUserTag'],
        CreateUserTagVariables,
        UpdateUserTag['updateUserTag'],
        UpdateUserTagVariables,
        DeleteUserTags> {

    constructor(userTagService: UserTagService,
                injector: Injector,
                public userService: UserService,
    ) {
        super('userTag', userTagService, injector);
    }
}
