import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../../admin/products/services/product.service';
import { AbstractInfiniteLoadList } from '../../../../../shared/classes/AbstractInfiniteLoadList';
import { Products, Products_products_items, ProductsVariables } from '../../../../../shared/generated-types';

export enum ProductsViewMode {
    grid = 'grid',
    list = 'list',
}

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends AbstractInfiniteLoadList<Products['products'], ProductsVariables> implements OnInit {

    public showTags = true;
    public viewMode: ProductsViewMode = ProductsViewMode.grid;
    public currentProductTag;

    public products: Products_products_items[] = [];

    public ProductsViewMode = ProductsViewMode;

    public title: string;

    constructor(route: ActivatedRoute, productService: ProductService, injector: Injector) {
        super(productService, injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.route.data.subscribe(data => {
            this.title = data.title;
            this.showTags = !!data.showTags;
            this.viewMode = data.viewMode || ProductsViewMode.grid;

            if (data.productTag && data.productTag.model) {
                this.currentProductTag = data.productTag.model;
                this.pagination({offset: null, pageIndex: 0, pageSize: 10});
                this.variablesManager.set('category',
                    {filter: {groups: [{conditions: [{productTags: {have: {values: [data.productTag.model.id]}}}]}]}});
            }
        });

    }

}
