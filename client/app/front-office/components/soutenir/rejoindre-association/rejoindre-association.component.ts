import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../../admin/products/services/product.service';
import {Product, ProductType} from '../../../../shared/generated-types';

@Component({
    selector: 'app-rejoindre-association',
    templateUrl: './rejoindre-association.component.html',
    styleUrls: ['./rejoindre-association.component.scss'],
})
export class RejoindreAssociationComponent implements OnInit {
    public ProductType = ProductType;

    public membershipProduct!: Product['product'];

    constructor(public productService: ProductService) {}

    ngOnInit(): void {
        this.productService.getMembershipProduct().subscribe(product => (this.membershipProduct = product));
    }
}
