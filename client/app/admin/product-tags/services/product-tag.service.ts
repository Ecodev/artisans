import {Injectable} from '@angular/core';
import {NaturalAbstractModelService, NaturalQueryVariablesManager} from '@ecodev/natural';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProductTag, ProductTags, ProductTagsVariables, ProductTagVariables} from '../../../shared/generated-types';
import {productTagQuery, productTagsQuery} from './product-tag.queries';

@Injectable({
    providedIn: 'root',
})
export class ProductTagService extends NaturalAbstractModelService<
    ProductTag['productTag'],
    ProductTagVariables,
    ProductTags['productTags'],
    ProductTagsVariables,
    never,
    never,
    never,
    never,
    never,
    never
> {
    public constructor() {
        super('productTag', productTagQuery, productTagsQuery, null, null, null);
    }

    public resolveByName(name: string): Observable<ProductTags['productTags']['items'][0]> {
        const qvm = new NaturalQueryVariablesManager<ProductTagsVariables>();
        qvm.set('variables', {filter: {groups: [{conditions: [{name: {equal: {value: name}}}]}]}});
        return this.getAll(qvm).pipe(map(res => res.items[0]));
    }
}
