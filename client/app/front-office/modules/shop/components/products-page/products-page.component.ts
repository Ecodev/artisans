import {Component, inject, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
    fromUrl,
    memorySessionStorageProvider,
    NaturalBackgroundDensityDirective,
    NaturalCapitalizePipe,
    NaturalPersistenceService,
    NaturalSrcDensityDirective,
} from '@ecodev/natural';
import {ProductService} from '../../../../../admin/products/services/product.service';
import {AbstractInfiniteLoadList} from '../../../../../shared/classes/AbstractInfiniteLoadList';
import {Products} from '../../../../../shared/generated-types';
import {StripTagsPipe} from '../../../../../shared/pipes/strip-tags.pipe';
import {TruncatePipe} from '../../../../../shared/pipes/truncate.pipe';
import {MatButtonModule} from '@angular/material/button';
import {PriceComponent} from '../../../../../shared/components/price/price.component';
import {TagsNavigationComponent} from '../../../../../shared/components/tags-navigation/tags-navigation.component';
import {CommonModule} from '@angular/common';

export enum ProductsViewMode {
    grid = 'grid',
    list = 'list',
}

@Component({
    selector: 'app-products-page',
    templateUrl: './products-page.component.html',
    styleUrl: './products-page.component.scss',
    providers: [
        // Provide a NaturalPersistenceService instance only for this component,
        // but with a memoryStorage to avoid storing pagination in session and
        // keep it only in URL instead
        {
            provide: NaturalPersistenceService,
            useClass: NaturalPersistenceService,
        },
        memorySessionStorageProvider,
    ],
    imports: [
        CommonModule,
        TagsNavigationComponent,
        RouterLink,
        PriceComponent,
        MatButtonModule,
        NaturalSrcDensityDirective,
        NaturalCapitalizePipe,
        TruncatePipe,
        StripTagsPipe,
        NaturalBackgroundDensityDirective,
    ],
})
export class ProductsPageComponent extends AbstractInfiniteLoadList<ProductService> implements OnInit {
    /**
     * If true, the three first items of grid have highlighted layout
     */
    @Input() public highlightFirstItems = true;

    /**
     * Display tags over products
     * Configurable by routing
     */
    public showTagsOnProducts = true;

    /**
     * Display tag navigation
     * Configurable by routing
     */
    public showTagsNavigation = true;

    /**
     * Display as grid or as list
     */
    public viewMode: ProductsViewMode = ProductsViewMode.grid;

    /**
     * Items to display
     */
    public products: Products['products']['items'][0][] = [];

    /**
     * Page main title
     */
    public title = '';

    /**
     * Template access
     */
    public ProductsViewMode = ProductsViewMode;

    /**
     * Pagination with page size as multiple of 3 to end correctly before "show more" button.
     */
    public override defaultPagination = {pageSize: 12, pageIndex: 0, offset: null};

    public constructor() {
        super(inject(ProductService));
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.title = this.route.snapshot.params.productTagName || this.route.snapshot.data.seo.title;

        this.route.data.subscribe(data => {
            this.showTagsOnProducts = !!data.showTagsOnProducts;
            this.showTagsNavigation = !!data.showTagsNavigation;
            this.viewMode = data.viewMode || ProductsViewMode.grid;

            if (data.productTag) {
                this.pagination({offset: null, pageIndex: 0, pageSize: 10});
                this.variablesManager.set('category', {
                    filter: {groups: [{conditions: [{productTags: {have: {values: [data.productTag.id]}}}]}]},
                });
            }
        });

        this.route.params.subscribe(params => {
            if (params.ns) {
                this.search(fromUrl(this.persistenceService.getFromUrl('ns', this.route)));
            }
        });
    }

    public getDetailLink(product: Products['products']['items'][0]): RouterLink['routerLink'] {
        return ['/larevuedurable', product.reviewNumber ? 'numero' : 'article', product.id];
    }
}
