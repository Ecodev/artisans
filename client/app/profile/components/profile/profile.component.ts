import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAlertService} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {CurrentUserForProfile, Membership, Product, ProductType} from '../../../shared/generated-types';
import {ProductService} from '../../../admin/products/services/product.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    public viewer: CurrentUserForProfile['viewer'] = null;
    public ProductType = ProductType;
    public Membership = Membership;

    public membershipProduct: Product['product'] | null = null;

    public constructor(
        public readonly userService: UserService,
        private readonly alertService: NaturalAlertService,
        private readonly route: ActivatedRoute,
        public readonly productService: ProductService,
    ) {}

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer.model;
        this.productService.getMembershipProduct().subscribe(product => (this.membershipProduct = product));
    }

    public requestMembershipEnd(): void {
        this.alertService
            .confirm(
                'Arrêter les cotisations',
                'Voulez-vous envoyer une demande pour arrêter les cotisations aux Artisans de la transition ?',
                'Envoyer',
            )
            .subscribe(confirmed => {
                if (confirmed) {
                    this.userService.requestMembershipEnd().subscribe(() => {
                        this.alertService.info("Une demande d'arrêt des cotisation a été envoyée");
                    });
                }
            });
    }
}
