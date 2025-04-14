import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
    CurrentUserForProfile,
    Products,
    ProductsVariables,
    ProductType,
    PurchasesVariables,
} from '../../../../../shared/generated-types';
import {ProductsPageComponent} from '../products-page/products-page.component';
import {AddToCartComponent} from '../add-to-cart/add-to-cart.component';
import {PriceComponent} from '../../../../../shared/components/price/price.component';
import {MatListModule} from '@angular/material/list';
import {MatRippleModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-product-page',
    templateUrl: './product-page.component.html',
    styleUrl: './product-page.component.scss',
    imports: [
        CommonModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
        NaturalSrcDensityDirective,
        MatRippleModule,
        MatListModule,
        PriceComponent,
        AddToCartComponent,
        ProductsPageComponent,
        NaturalCapitalizePipe,
    ],
})
export class ProductPageComponent extends NaturalAbstractDetail<ProductService> implements OnInit {
    private readonly purchaseService = inject(PurchaseService);

    @ViewChild(ProductsPageComponent, {static: false}) public relatedProducts: ProductsPageComponent | null = null;

    public ProductType = ProductType;

    /**
     * True if we are in edition mode after selecting an existing cart line from cart list. Activates some special layout for line update
     */
    public edit = false;

    /**
     * Formatted displayed price
     */
    public price = 0;

    /**
     * Form controller for quantity
     */
    public quantityForm = new FormControl(null, [Validators.required, Validators.min(0)]);

    /**
     * Combination of form controls of the page
     */
    public readonly formGroup = new FormGroup({quantity: this.quantityForm});
    public viewer: CurrentUserForProfile['viewer'] = null;

    /**
     * Hide buy digital version if it has already been bought as it can be bought only once.
     */
    public showBuyDigital = false;

    /**
     * List of articles contained in current number
     */
    public articles: Products['products']['items'][0][] = [];

    /**
     * Boolean that represents the sub-articles navigation menu visibility
     */
    public articlesMenuOpen = false;

    /**
     * Hide buy paper version if it has already been bought as it can be bought only once.
     */
    public showBuyPaper = false;

    public url: string;

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
                const qvmArticles = new NaturalQueryVariablesManager<ProductsVariables>();
                qvmArticles.set('variables', {
                    filter: {groups: [{conditions: [{review: {in: {values: [reviewProduct.id]}}}]}]},
                });
                this.service.getAll(qvmArticles).subscribe(result => (this.articles = result.items));
            } else {
                this.articles = [];
            }

            const qvm = new NaturalQueryVariablesManager<PurchasesVariables>();
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
