import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import { createUserTagMutation, deleteUserTagsMutation, updateUserTagMutation, userTagQuery, userTagsQuery } from './userTag.queries';
import {
    CreateUserTagMutation,
    CreateUserTagMutationVariables,
    UpdateUserTagMutation,
    UpdateUserTagMutationVariables,
    UserTagInput,
    UserTagQuery,
    UserTagQueryVariables,
    UserTagsQuery,
    UserTagsQueryVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class UserTagService extends AbstractModelService<UserTagQuery['userTag'],
    UserTagQueryVariables,
    UserTagsQuery['userTags'],
    UserTagsQueryVariables,
    CreateUserTagMutation['createUserTag'],
    CreateUserTagMutationVariables,
    UpdateUserTagMutation['updateUserTag'],
    UpdateUserTagMutationVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo, 'userTag', userTagQuery, userTagsQuery, createUserTagMutation, updateUserTagMutation, deleteUserTagsMutation);
    }

    public getEmptyObject(): UserTagInput {
        return {
            name: '',
            color: ''
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            color: [],
        };
    }

}
