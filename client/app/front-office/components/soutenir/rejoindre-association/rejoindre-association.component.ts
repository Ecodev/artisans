import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../../admin/products/services/product.service';
import {Product, ProductType} from '../../../../shared/generated-types';
import {AddToCartComponent} from '../../../modules/shop/components/add-to-cart/add-to-cart.component';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-rejoindre-association',
    templateUrl: './rejoindre-association.component.html',
    styleUrls: ['./rejoindre-association.component.scss'],
    standalone: true,
    imports: [FlexModule, AddToCartComponent],
})
export class RejoindreAssociationComponent implements OnInit {
    public ProductType = ProductType;

    public membershipProduct!: Product['product'];

    public constructor(public readonly productService: ProductService) {}

    public ngOnInit(): void {
        this.productService.getMembershipProduct().subscribe(product => (this.membershipProduct = product));
    }
}
