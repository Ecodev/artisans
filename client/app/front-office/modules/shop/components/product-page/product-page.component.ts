import {Component, inject, OnInit} from '@angular/core';
import {
    NaturalAbstractDetail,
    NaturalCapitalizePipe,
    NaturalIconDirective,
    NaturalQueryVariablesManager,
    NaturalSrcDensityDirective,
} from '@ecodev/natural';
import {ProductService} from '../../../../../admin/products/services/product.service';
import {PurchaseService} from '../../../../../profile/components/purchases/purchase.service';
import {
    CurrentUserForProfileQuery,
    ProductsQuery,
    ProductsQueryVariables,
    ProductType,
    PurchasesQueryVariables,
} from '../../../../../shared/generated-types';
import {ProductsPageComponent} from '../products-page/products-page.component';
import {AddToCartComponent} from '../add-to-cart/add-to-cart.component';
import {PriceComponent} from '../../../../../shared/components/price/price.component';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatRipple} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-product-page',
    imports: [
        DatePipe,
        MatButton,
        RouterLink,
        MatIcon,
        NaturalIconDirective,
        NaturalSrcDensityDirective,
        MatRipple,
        MatNavList,
        MatListItem,
        PriceComponent,
        AddToCartComponent,
        ProductsPageComponent,
        NaturalCapitalizePipe,
        MatMiniFabButton,
    ],
    templateUrl: './product-page.component.html',
    styleUrl: './product-page.component.scss',
})
export class ProductPageComponent extends NaturalAbstractDetail<ProductService> implements OnInit {
    private readonly purchaseService = inject(PurchaseService);

    protected readonly ProductType = ProductType;

    protected viewer: CurrentUserForProfileQuery['viewer'] = null;

    /**
     * Hide buy digital version if it has already been bought as it can be bought only once.
     */
    protected showBuyDigital = false;

    /**
     * List of articles contained in current number
     */
    protected articles: ProductsQuery['products']['items'][0][] = [];

    /**
     * Boolean that represents the sub-articles navigation menu visibility
     */
    protected articlesMenuOpen = false;

    /**
     * Hide buy paper version if it has already been bought as it can be bought only once.
     */
    protected showBuyPaper = false;

    protected url: string;

    public constructor() {
        super('product', inject(ProductService));

        this.url = this.router.url;
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.viewer = this.route.snapshot.data.viewer ? this.route.snapshot.data.viewer : null;

        this.route.data.subscribe(() => {
            this.articlesMenuOpen = false;

            const reviewProduct = this.data.model.review || this.data.model;

            if (reviewProduct) {
                const qvmArticles = new NaturalQueryVariablesManager<ProductsQueryVariables>();
                qvmArticles.set('variables', {
                    filter: {groups: [{conditions: [{review: {in: {values: [reviewProduct.id]}}}]}]},
                });
                this.service.getAll(qvmArticles).subscribe(result => (this.articles = result.items));
            } else {
                this.articles = [];
            }

            const qvm = new NaturalQueryVariablesManager<PurchasesQueryVariables>();
            if (this.isUpdatePage()) {
                qvm.set('variables', {filter: {groups: [{conditions: [{id: {equal: {value: this.data.model.id}}}]}]}});
            }

            // Show button to buy only if we didn't already bought those version
            this.purchaseService.getAll(qvm).subscribe(purchases => {
                const digital = [ProductType.Both, ProductType.Digital];
                const paper = [ProductType.Both, ProductType.Paper];

                this.showBuyDigital =
                    digital.includes(this.data.model.type) &&
                    !purchases.items.some(orderLine => digital.includes(orderLine.type)) &&
                    !this.data.model.file; // A digital might be allowed via subscription, not purchase

                this.showBuyPaper = paper.includes(this.data.model.type);
            });
        });
    }
}
