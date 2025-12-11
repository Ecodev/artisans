import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NaturalAlertService, NaturalEnumPipe, NaturalIconDirective} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {CurrentUserForProfile, Membership, Product, ProductType} from '../../../shared/generated-types';
import {ProductService} from '../../../admin/products/services/product.service';
import {MatListItem, MatNavList} from '@angular/material/list';
import {AddToCartComponent} from '../../../front-office/modules/shop/components/add-to-cart/add-to-cart.component';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-profile',
    imports: [
        AsyncPipe,
        MatButton,
        MatIcon,
        NaturalIconDirective,
        RouterLink,
        AddToCartComponent,
        MatNavList,
        MatListItem,
        RouterLinkActive,
        RouterOutlet,
        NaturalEnumPipe,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
    protected readonly userService = inject(UserService);
    private readonly alertService = inject(NaturalAlertService);
    private readonly route = inject(ActivatedRoute);
    protected readonly productService = inject(ProductService);

    protected viewer: CurrentUserForProfile['viewer'] = null;
    protected readonly ProductType = ProductType;
    protected readonly Membership = Membership;

    protected membershipProduct: Product['product'] | null = null;

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer;
        this.productService.getMembershipProduct().subscribe(product => (this.membershipProduct = product));
    }

    protected requestMembershipEnd(): void {
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
