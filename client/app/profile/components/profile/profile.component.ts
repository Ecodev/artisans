import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NaturalAlertService, NaturalIconDirective, NaturalEnumPipe} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {CurrentUserForProfile, Membership, Product, ProductType} from '../../../shared/generated-types';
import {ProductService} from '../../../admin/products/services/product.service';
import {MatListModule} from '@angular/material/list';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {AddToCartComponent} from '../../../front-office/modules/shop/components/add-to-cart/add-to-cart.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        FlexModule,
        MatButtonModule,
        MatIconModule,
        NaturalIconDirective,
        RouterLink,
        AddToCartComponent,
        ExtendedModule,
        MatListModule,
        RouterLinkActive,
        RouterOutlet,
        NaturalEnumPipe,
    ],
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
