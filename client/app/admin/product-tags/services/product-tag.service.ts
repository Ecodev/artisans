import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {NaturalAbstractModelService, NaturalDebounceService, NaturalQueryVariablesManager} from '@ecodev/natural';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProductTag, ProductTags, ProductTagsVariables, ProductTagVariables} from '../../../shared/generated-types';
import {productTagQuery, productTagsQuery} from './product-tag.queries';
import {ProductTagByNameResolve} from './product-tag-by-name.resolver';

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
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(apollo, naturalDebounceService, 'productTag', productTagQuery, productTagsQuery, null, null, null);
    }

    public resolveByName(name: string): Observable<ProductTagByNameResolve> {
        const qvm = new NaturalQueryVariablesManager<ProductTagsVariables>();
        qvm.set('variables', {filter: {groups: [{conditions: [{name: {equal: {value: name}}}]}]}});
        return this.getAll(qvm).pipe(map(res => ({model: res.items[0]})));
    }
}
