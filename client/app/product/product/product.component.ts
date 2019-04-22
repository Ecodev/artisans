import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../admin/products/services/product.service';
import { UserService } from '../../admin/users/services/user.service';
import { NaturalAbstractController } from '@ecodev/natural';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent extends NaturalAbstractController implements OnInit {

    /**
     * If the booking is free / available for a new navigation
     */
    public isAvailable: boolean;

    public canAccessAdmin: boolean;

    public product;

    constructor(private productService: ProductService,
                private route: ActivatedRoute,
    ) {
        super();
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.product = data.product.model;
            if (this.product) {
                this.initForProduct();
            }
        });

    }

    private initForProduct() {
        const viewer = this.route.snapshot.data.viewer.model;
        this.canAccessAdmin = UserService.canAccessAdmin(viewer);
    }
}
