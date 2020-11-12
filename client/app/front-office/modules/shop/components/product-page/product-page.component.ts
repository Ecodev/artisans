import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NaturalAbstractDetail, NaturalQueryVariablesManager} from '@ecodev/natural';
import {ProductService} from '../../../../../admin/products/services/product.service';
import {PurchaseService} from '../../../../../profile/components/purchases/purchase.service';
import {
    CreateProduct,
    CreateProductVariables,
    CurrentUserForProfile_viewer,
    DeleteProducts,
    DeleteProductsVariables,
    Product,
    Products_products_items,
    ProductsVariables,
    ProductType,
    ProductVariables,
    PurchasesVariables,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../../../shared/generated-types';
import {ProductsPageComponent} from '../products-page/products-page.component';

@Component({
    selector: 'app-product-page',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent
    extends NaturalAbstractDetail<
        Product['product'],
        ProductVariables,
        CreateProduct['createProduct'],
        CreateProductVariables,
        UpdateProduct['updateProduct'],
        UpdateProductVariables,
        DeleteProducts,
        DeleteProductsVariables
    >
    implements OnInit {
    @ViewChild(ProductsPageComponent, {static: false}) public relatedProducts!: ProductsPageComponent;

    public ProductType = ProductType;

    /**
     * Resolved model product. Called data to stay compliant with usual providing naming and usage in template
     */
    public data: any;

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
    public formGroup = new FormGroup({quantity: this.quantityForm});
    public viewer: CurrentUserForProfile_viewer | null = null;

    /**
     * Hide buy digital version if it has already been bought as it can be bought only once.
     */
    public showBuyDigital = false;

    /**
     * List of articles contained in current number
     */
    public articles: Products_products_items[] = [];

    /**
     * Boolean that represents the sub-articles navigation menu visibility
     */
    public articlesMenuOpen = false;

    /**
     * Hide buy paper version if it has already been bought as it can be bought only once.
     */
    public showBuyPaper = false;

    public url: string;

    constructor(private productService: ProductService, private purchaseService: PurchaseService, injector: Injector) {
        super('product', productService, injector);
        this.url = this.router.url;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.viewer = this.route.snapshot.data.viewer ? this.route.snapshot.data.viewer.model : null;

        this.route.data.subscribe(data => {
            this.articlesMenuOpen = false;

            const reviewProduct = data.product.model.review || data.product.model;

            if (reviewProduct) {
                const qvmArticles = new NaturalQueryVariablesManager<ProductsVariables>();
                qvmArticles.set('variables', {
                    filter: {groups: [{conditions: [{review: {in: {values: [reviewProduct.id]}}}]}]},
                });
                this.productService.getAll(qvmArticles).subscribe(result => (this.articles = result.items));
            } else {
                this.articles = [];
            }

            const qvm = new NaturalQueryVariablesManager<PurchasesVariables>();
            qvm.set('variables', {filter: {groups: [{conditions: [{id: {equal: {value: this.data.model.id}}}]}]}});

            // Show button to buy only if we didn't already bought those version
            this.purchaseService.getAll(qvm).subscribe(purchases => {
                const digital = [ProductType.both, ProductType.digital];
                const paper = [ProductType.both, ProductType.paper];

                this.showBuyDigital =
                    digital.includes(this.data.model.type) &&
                    !purchases.items.some(orderLine => digital.includes(orderLine.type)) &&
                    !this.data.model.file; // A digital might be allowed via subscription, not purchase

                this.showBuyPaper = paper.includes(this.data.model.type);
            });
        });
    }
}
