import {Component, inject, OnInit} from '@angular/core';
import {ProductService} from '../../../../admin/products/services/product.service';
import {Product, ProductType} from '../../../../shared/generated-types';
import {AddToCartComponent} from '../../../modules/shop/components/add-to-cart/add-to-cart.component';

@Component({
    selector: 'app-rejoindre-association',
    imports: [AddToCartComponent],
    templateUrl: './rejoindre-association.component.html',
    styleUrl: './rejoindre-association.component.scss',
})
export class RejoindreAssociationComponent implements OnInit {
    protected readonly productService = inject(ProductService);

    protected readonly ProductType = ProductType;

    protected membershipProduct!: Product['product'];

    public ngOnInit(): void {
        this.productService.getMembershipProduct().subscribe(product => (this.membershipProduct = product));
    }
}
