import {Component, Input, OnInit} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {ProductTagService} from '../../../admin/product-tags/services/product-tag.service';
import {ProductTags, ProductTagsVariables} from '../../generated-types';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-tags-navigation',
    templateUrl: './tags-navigation.component.html',
    styleUrls: ['./tags-navigation.component.scss'],
})
export class TagsNavigationComponent implements OnInit {
    /**
     * Items to list
     */
    @Input() public items: ProductTags['productTags']['items'][0][] = [];

    /**
     * Service to use to get items
     */
    @Input() public service!: ProductTagService;

    /**
     * Url base
     */
    @Input() public linkBase: any[] = [];

    public ngOnInit(): void {
        if (this.service) {
            const qvm = new NaturalQueryVariablesManager<ProductTagsVariables>();
            this.service.getAll(qvm).subscribe(result => {
                this.items = result.items;
            });
        }
    }

    public getLink(item: ProductTags['productTags']['items'][0]): RouterLink['routerLink'] {
        return [...this.linkBase, item.name];
    }
}
