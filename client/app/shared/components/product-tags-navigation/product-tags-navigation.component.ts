import { Component, Input, OnInit } from '@angular/core';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
import { ProductTagService } from '../../../admin/product-tags/services/product-tag.service';
import { ProductTags_productTags_items, ProductTagsVariables } from '../../generated-types';

interface ActivableProductTag extends ProductTags_productTags_items {
    active: boolean;
}

@Component({
    selector: 'app-product-tags-navigation',
    templateUrl: './product-tags-navigation.component.html',
    styleUrls: ['./product-tags-navigation.component.scss'],
})
export class ProductTagsNavigationComponent implements OnInit {

    private _current: ProductTags_productTags_items;

    @Input() set current(value: ProductTags_productTags_items) {
        this._current = value;

        if (this.tags) {
            this.tags.forEach(tag => tag.active = value && tag.id === value.id);
        }
    }

    public tags: ActivableProductTag[];

    constructor(private productTagService: ProductTagService) {
    }

    ngOnInit() {
        const qvm = new NaturalQueryVariablesManager<ProductTagsVariables>();
        this.productTagService.getAll(qvm).subscribe(result => {
            this.tags = result.items.map(tag => Object.assign(tag, {active: false}));
            this.current = this._current;
        });
    }

}
