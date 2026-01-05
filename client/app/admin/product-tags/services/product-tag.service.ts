import {Injectable} from '@angular/core';
import {NaturalAbstractModelService, NaturalQueryVariablesManager} from '@ecodev/natural';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    ProductTagQuery,
    ProductTagsQuery,
    ProductTagsQueryVariables,
    ProductTagQueryVariables,
} from '../../../shared/generated-types';
import {productTagQuery, productTagsQuery} from './product-tag.queries';

@Injectable({
    providedIn: 'root',
})
export class ProductTagService extends NaturalAbstractModelService<
    ProductTagQuery['productTag'],
    ProductTagQueryVariables,
    ProductTagsQuery['productTags'],
    ProductTagsQueryVariables,
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

    public resolveByName(name: string): Observable<ProductTagsQuery['productTags']['items'][0]> {
        const qvm = new NaturalQueryVariablesManager<ProductTagsQueryVariables>();
        qvm.set('variables', {filter: {groups: [{conditions: [{name: {equal: {value: name}}}]}]}});
        return this.getAll(qvm).pipe(map(res => res.items[0]));
    }
}
