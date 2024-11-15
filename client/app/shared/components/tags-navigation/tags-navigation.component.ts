import {Component, inject, Input} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {ProductTagService} from '../../../admin/product-tags/services/product-tag.service';
import {ProductTags, ProductTagsVariables} from '../../generated-types';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-tags-navigation',
    templateUrl: './tags-navigation.component.html',
    styleUrl: './tags-navigation.component.scss',
    standalone: true,
    imports: [RouterLink],
})
export class TagsNavigationComponent {
    /**
     * Items to list
     */
    public items: ProductTags['productTags']['items'][0][] = [];

    /**
     * Url base
     */
    @Input() public linkBase: any[] = [];

    public constructor() {
        const productTagService = inject(ProductTagService);

        const qvm = new NaturalQueryVariablesManager<ProductTagsVariables>();
        productTagService.getAll(qvm).subscribe(result => {
            this.items = result.items;
        });
    }

    public getLink(item: ProductTags['productTags']['items'][0]): RouterLink['routerLink'] {
        return [...this.linkBase, item.name];
    }
}
