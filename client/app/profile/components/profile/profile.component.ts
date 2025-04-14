import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NaturalAlertService, NaturalEnumPipe, NaturalIconDirective} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {CurrentUserForProfile, Membership, Product, ProductType} from '../../../shared/generated-types';
import {ProductService} from '../../../admin/products/services/product.service';
import {MatListModule} from '@angular/material/list';
import {AddToCartComponent} from '../../../front-office/modules/shop/components/add-to-cart/add-to-cart.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        NaturalIconDirective,
        RouterLink,
        AddToCartComponent,
        MatListModule,
        RouterLinkActive,
        RouterOutlet,
        NaturalEnumPipe,
    ],
})
export class ProfileComponent implements OnInit {
    public readonly userService = inject(UserService);
    private readonly alertService = inject(NaturalAlertService);
    private readonly route = inject(ActivatedRoute);
    public readonly productService = inject(ProductService);

    public viewer: CurrentUserForProfile['viewer'] = null;
    public ProductType = ProductType;
    public Membership = Membership;

    public membershipProduct: Product['product'] | null = null;

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer;
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
