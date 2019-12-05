import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAbstractList } from '@ecodev/natural';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../../../../admin/products/services/product.service';
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
export class ProductsComponent extends NaturalAbstractList<Products['products'], ProductsVariables> implements OnInit {

    public showTags = true;
    public viewMode: ProductsViewMode = ProductsViewMode.grid;

    public products: Products_products_items[] = [];

    public ProductsViewMode = ProductsViewMode;

    public title: string;

    constructor(route: ActivatedRoute, productService: ProductService, injector: Injector) {
        super(productService, injector);

        this.persistSearch = false;
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.route.data.subscribe(data => {
            console.log('data', data);

            this.title = data.title;
            this.showTags = !!data.showTags;
            this.viewMode = data.viewMode || ProductsViewMode.grid;

            if (data.productTag && data.productTag.model) {
                this.variablesManager.set('category',
                    {filter: {groups: [{conditions: [{productTags: {have: {values: [data.productTag.model.id]}}}]}]}});
            }
        });

        this.dataSource.internalDataObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {

            if (result.pageIndex === 0) {
                this.products = result.items;
            } else {
                this.products.push(...result.items);
            }
        });

    }

    public loadMore() {
        this.pagination({offset: null, pageIndex: this.dataSource.data.pageIndex + 1, pageSize: 10});
    }

}
