import {Component, OnInit, inject} from '@angular/core';
import {ProductService} from '../../../../admin/products/services/product.service';
import {Product, ProductType} from '../../../../shared/generated-types';
import {AddToCartComponent} from '../../../modules/shop/components/add-to-cart/add-to-cart.component';

@Component({
    selector: 'app-rejoindre-association',
    templateUrl: './rejoindre-association.component.html',
    styleUrl: './rejoindre-association.component.scss',
    standalone: true,
    imports: [AddToCartComponent],
})
export class RejoindreAssociationComponent implements OnInit {
    public readonly productService = inject(ProductService);

    public ProductType = ProductType;

    public membershipProduct!: Product['product'];

    public ngOnInit(): void {
        this.productService.getMembershipProduct().subscribe(product => (this.membershipProduct = product));
    }
}
