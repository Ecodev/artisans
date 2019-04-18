import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../natural/services/abstract-model.service';
import { createUserTag, deleteUserTags, updateUserTag, userTagQuery, userTagsQuery } from './userTag.queries';
import {
    CreateUserTag,
    CreateUserTagVariables,
    UpdateUserTag,
    UpdateUserTagVariables,
    UserTagInput,
    UserTag,
    UserTagVariables,
    UserTags,
    UserTagsVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class UserTagService extends AbstractModelService<UserTag['userTag'],
    UserTagVariables,
    UserTags['userTags'],
    UserTagsVariables,
    CreateUserTag['createUserTag'],
    CreateUserTagVariables,
    UpdateUserTag['updateUserTag'],
    UpdateUserTagVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo, 'userTag', userTagQuery, userTagsQuery, createUserTag, updateUserTag, deleteUserTags);
    }

    protected getDefaultForServer(): UserTagInput {
        return {
            name: '',
            color: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            color: [],
        };
    }

}
