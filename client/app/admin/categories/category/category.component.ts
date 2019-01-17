import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import {
    CreateCategoryMutation,
    CreateCategoryMutationVariables, DeleteCategoriesMutation,
    CategoryQuery,
    CategoryQueryVariables,
    UpdateCategoryMutation, UpdateCategoryMutationVariables,
} from '../../../shared/generated-types';
import { CategoryService } from '../services/category.service';


@Component({
    selector: 'app-bookable-tag',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent
    extends AbstractDetail<CategoryQuery['category'],
        CategoryQueryVariables,
        CreateCategoryMutation['createCategory'],
        CreateCategoryMutationVariables,
        UpdateCategoryMutation['updateCategory'],
        UpdateCategoryMutationVariables,
        DeleteCategoriesMutation> {

    constructor(alertService: AlertService,
                categoryService: CategoryService,
                router: Router,
                route: ActivatedRoute,
                public tagService: CategoryService,
    ) {
        super('category', categoryService, alertService, router, route);
    }
}
