import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAlertService} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {CurrentUserForProfile, Product, ProductType} from '../../../shared/generated-types';
import {ProductService} from '../../../admin/products/services/product.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    public viewer: CurrentUserForProfile['viewer'];
    public ProductType = ProductType;

    public membershipProduct: Product['product'];

    constructor(
        public userService: UserService,
        private alertService: NaturalAlertService,
        private route: ActivatedRoute,
        public productService: ProductService,
    ) {}

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer.model;
        this.productService.getMembershipProduct().subscribe(product => (this.membershipProduct = product));
    }
}
