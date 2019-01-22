import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import {
    CategoryQuery,
    CategoryQueryVariables,
    CreateCategoryMutation,
    CreateCategoryMutationVariables,
    DeleteCategoriesMutation,
    UpdateCategoryMutation,
    UpdateCategoryMutationVariables,
} from '../../../shared/generated-types';
import { CategoryService } from '../services/category.service';
import { CategoryConfiguration } from '../../../shared/hierarchic-selector/configurations/CategoryConfiguration';

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

    public hierarchicConfig = CategoryConfiguration;

    constructor(alertService: AlertService,
                categoryService: CategoryService,
                router: Router,
                route: ActivatedRoute,
    ) {
        super('category', categoryService, alertService, router, route);
    }
}
