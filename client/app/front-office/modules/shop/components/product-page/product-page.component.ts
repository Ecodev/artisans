import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../../../../admin/products/services/product.service';
import { UserService } from '../../../../../admin/users/services/user.service';
import {
    CreateProduct,
    CreateProductVariables,
    CurrentUserForProfile,
    Product,
    ProductType,
    ProductVariables,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../../../shared/generated-types';

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

    constructor(private productService: ProductService, injector: Injector, private userService: UserService) {
        super('product', productService, injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.userService.getViewer().pipe(takeUntil(this.ngUnsubscribe)).subscribe(viewer => this.viewer = viewer);
    }

}
