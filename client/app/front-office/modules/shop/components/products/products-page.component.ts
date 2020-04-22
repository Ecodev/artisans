import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromUrl, memoryStorageProvider, NaturalPersistenceService } from '@ecodev/natural';
import { ProductService } from '../../../../../admin/products/services/product.service';
import { AbstractInfiniteLoadList } from '../../../../../shared/classes/AbstractInfiniteLoadList';
import { Products, Products_products_items, ProductsVariables } from '../../../../../shared/generated-types';

export enum ProductsViewMode {
    grid = 'grid',
    list = 'list',
}

@Component({
    selector: 'app-products-page',
    templateUrl: './products-page.component.html',
    styleUrls: ['./products-page.component.scss'],
    providers: [
        // Provide a NaturalPersistenceService instance only for this component,
        // but with a memoryStorage to avoid storing pagination in session and
        // keep it only in URL instead
        {
            provide: NaturalPersistenceService,
            useClass: NaturalPersistenceService,
        },
        memoryStorageProvider,
    ],
})
export class ProductsPageComponent extends AbstractInfiniteLoadList<Products['products'], ProductsVariables> implements OnInit {

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

        this.title = this.route.snapshot.params.productTagName || this.route.snapshot.data.title;

        this.route.data.subscribe(data => {
            this.showTags = !!data.showTags;
            this.viewMode = data.viewMode || ProductsViewMode.grid;

            if (data.productTag && data.productTag.model) {
                this.currentProductTag = data.productTag.model;
                this.pagination({offset: null, pageIndex: 0, pageSize: 10});
                this.variablesManager.set('category',
                    {filter: {groups: [{conditions: [{productTags: {have: {values: [data.productTag.model.id]}}}]}]}});
            }
        });

        this.route.params.subscribe(params => {
            if (params['ns']) {
                this.search(fromUrl(this.persistenceService.getFromUrl('ns', this.route)));
            }
        });

    }

}
