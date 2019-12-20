import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormAsyncValidators, FormValidators, NaturalAbstractModelService, NaturalValidators } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import {
    CreateUserTag,
    CreateUserTagVariables,
    UpdateUserTag,
    UpdateUserTagVariables,
    UserTag,
    UserTagInput,
    UserTags,
    UserTagsVariables,
    UserTagVariables,
} from '../../../shared/generated-types';
import { createUserTag, deleteUserTags, updateUserTag, userTagQuery, userTagsQuery } from './user-tag.queries';

@Injectable({
    providedIn: 'root',
})
export class UserTagService extends NaturalAbstractModelService<UserTag['userTag'],
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

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            color: [],
        };
    }

    public getFormAsyncValidators(): FormAsyncValidators {
        return {
            name: [NaturalValidators.unique('name', this)],
        };
    }

    protected getDefaultForServer(): UserTagInput {
        return {
            name: '',
            color: '',
        };
    }

}
