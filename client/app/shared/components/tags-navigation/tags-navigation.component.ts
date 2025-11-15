import {Component, inject, input} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {ProductTagService} from '../../../admin/product-tags/services/product-tag.service';
import {ProductTags, ProductTagsVariables} from '../../generated-types';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-tags-navigation',
    imports: [RouterLink],
    templateUrl: './tags-navigation.component.html',
    styleUrl: './tags-navigation.component.scss',
})
export class TagsNavigationComponent {
    /**
     * Items to list
     */
    protected items: ProductTags['productTags']['items'][0][] = [];

    /**
     * Url base
     */
    public readonly linkBase = input<any[]>([]);

    public constructor() {
        const productTagService = inject(ProductTagService);

        const qvm = new NaturalQueryVariablesManager<ProductTagsVariables>();
        productTagService.getAll(qvm).subscribe(result => {
            this.items = result.items;
        });
    }

    protected getLink(item: ProductTags['productTags']['items'][0]): RouterLink['routerLink'] {
        return [...this.linkBase(), item.name];
    }
}
