import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {
    FormAsyncValidators,
    FormValidators,
    NaturalAbstractModelService,
    NaturalDebounceService,
    NaturalQueryVariablesManager,
    unique,
} from '@ecodev/natural';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    CreateProductTag,
    CreateProductTagVariables,
    DeleteProductTags,
    DeleteProductTagsVariables,
    ProductTag,
    ProductTagInput,
    ProductTags,
    ProductTagsVariables,
    ProductTagVariables,
    UpdateProductTag,
    UpdateProductTagVariables,
} from '../../../shared/generated-types';
import {
    createProductTag,
    deleteProductTags,
    productTagQuery,
    productTagsQuery,
    updateProductTag,
} from './product-tag.queries';
import {ProductTagByNameResolve} from './product-tag-by-name.resolver';

@Injectable({
    providedIn: 'root',
})
export class ProductTagService extends NaturalAbstractModelService<
    ProductTag['productTag'],
    ProductTagVariables,
    ProductTags['productTags'],
    ProductTagsVariables,
    CreateProductTag['createProductTag'],
    CreateProductTagVariables,
    UpdateProductTag['updateProductTag'],
    UpdateProductTagVariables,
    DeleteProductTags,
    DeleteProductTagsVariables
> {
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(
            apollo,
            naturalDebounceService,
            'productTag',
            productTagQuery,
            productTagsQuery,
            createProductTag,
            updateProductTag,
            deleteProductTags,
        );
    }

    public override getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

    public override getFormAsyncValidators(model: ProductTag['productTag']): FormAsyncValidators {
        return {
            name: [unique('name', model.id, this)],
        };
    }

    public resolveByName(name: string): Observable<ProductTagByNameResolve> {
        const qvm = new NaturalQueryVariablesManager<ProductTagsVariables>();
        qvm.set('variables', {filter: {groups: [{conditions: [{name: {equal: {value: name}}}]}]}});
        return this.getAll(qvm).pipe(map(res => ({model: res.items[0]})));
    }

    public override getDefaultForServer(): ProductTagInput {
        return {
            name: '',
            color: '',
        };
    }
}
