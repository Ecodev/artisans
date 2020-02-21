import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NaturalAbstractDetail, NaturalQueryVariablesManager } from '@ecodev/natural';
import { ProductService } from '../../../../../admin/products/services/product.service';
import { getDownloadLink } from '../../../../../shared/components/file/file.component';
import {
    CreateProduct,
    CreateProductVariables,
    CurrentUserForProfile,
    Product,
    Product_product,
    ProductType,
    ProductVariables,
    PurchasesVariables,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../../../shared/generated-types';
import { PurchaseService } from '../../../../../profile/components/purchases/purchase.service';

@Component({
    selector: 'app-product-page',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent
    extends NaturalAbstractDetail<Product['product'],
        ProductVariables,
        CreateProduct['createProduct'],
        CreateProductVariables,
        UpdateProduct['updateProduct'],
        UpdateProductVariables,
        any> implements OnInit {

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
    public viewer: CurrentUserForProfile['viewer'];
    public showBuyPaper = false;
    public showBuyDigital = false;

    constructor(
        private productService: ProductService,
        private purchaseService: PurchaseService,
        injector: Injector,
    ) {
        super('product', productService, injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.viewer = this.route.snapshot.data.viewer ? this.route.snapshot.data.viewer.model : null;

        const qvm = new NaturalQueryVariablesManager<PurchasesVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{id: {equal: {value: this.data.model.id}}}]}]},
        });

        // Show button to buy only if we didn't already bought those version
        this.purchaseService.getAll(qvm).subscribe(purchases => {
            const paper = [ProductType.both, ProductType.paper];
            const digital = [ProductType.both, ProductType.digital];

            this.showBuyPaper = paper.includes(this.data.model.type)
                && !purchases.items.some(orderLine => paper.includes(orderLine.type));

            this.showBuyDigital = digital.includes(this.data.model.type)
                && !purchases.items.some(orderLine => digital.includes(orderLine.type))
                && !this.data.model.file; // A digital might be allowed via subscription, not purchase
        });
    }

    public getDownloadLink(product: Product_product): null | string {
        if (product.file) {
            return getDownloadLink(product.file);
        }

        return null;
    }
}
