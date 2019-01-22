import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    categoriesQuery,
    categoryQuery,
    createCategoryMutation,
    deleteCategoriesMutation,
    updateCategoryMutation,
} from './category.queries';
import {
    CategoriesQuery,
    CategoriesQueryVariables,
    CategoryInput,
    CategoryQuery,
    CategoryQueryVariables,
    CreateCategoryMutation,
    CreateCategoryMutationVariables,
    UpdateCategoryMutation,
    UpdateCategoryMutationVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends AbstractModelService<CategoryQuery['category'],
    CategoryQueryVariables,
    CategoriesQuery['categories'],
    CategoriesQueryVariables,
    CreateCategoryMutation['createCategory'],
    CreateCategoryMutationVariables,
    UpdateCategoryMutation['updateCategory'],
    UpdateCategoryMutationVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'category',
            categoryQuery,
            categoriesQuery,
            createCategoryMutation,
            updateCategoryMutation,
            deleteCategoriesMutation);
    }

    public getEmptyObject(): CategoryInput {
        return {
            name: '',
            color: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

}
