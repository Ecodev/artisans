import { Injectable } from '@angular/core';
import {
    DropdownFacet,
    FlagFacet,
    NaturalEnumService,
    NaturalSearchFacets,
    NaturalSearchSelection,
    TypeDateComponent,
    TypeDateConfiguration,
    TypeNaturalSelectComponent,
    TypeNumberComponent,
    TypeNumberConfiguration,
    TypeSelectComponent,
    TypeSelectConfiguration,
    TypeSelectNaturalConfiguration,
    TypeTextComponent,
    wrapLike,
} from '@ecodev/natural';
import { ProductTagService } from '../../admin/product-tags/services/product-tag.service';
import { ProductService } from '../../admin/products/services/product.service';
import { UserTagService } from '../../admin/user-tags/services/user-tag.service';
import { UserService } from '../../admin/users/services/user.service';
import { ProductFilterGroupCondition, UserFilterGroupCondition } from '../generated-types';

/**
 * Convert percentage for server
 */
function percentage(selection: NaturalSearchSelection): NaturalSearchSelection {
    Object.keys(selection.condition).forEach(key => {
        if (selection.condition && selection.condition[key]) {
            const condition = selection.condition[key];
            if (condition && condition.value) {
                condition.value = condition.value / 100;
            }
        }
    });

    return selection;
}

function dontHave(selection: NaturalSearchSelection): NaturalSearchSelection {
    if (selection.condition && selection.condition.have) {
        selection.condition.have.not = true;
    }
    return selection;
}

/**
 * Collection of facets for natural-search accessible by the object name
 */
@Injectable({
    providedIn: 'root',
})
export class NaturalSearchFacetsService {

    private readonly userTags: DropdownFacet<TypeSelectNaturalConfiguration> = {
        display: 'Tags',
        name: 'withTags',
        field: 'userTags',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: this.userTagService,
            placeholder: 'Tags',
        },
    };

    private readonly userWithNoTags: FlagFacet = {
        display: 'Sans tag',
        field: 'userTags',
        name: 'userNoTags',
        condition: {empty: {}} as UserFilterGroupCondition,
    };

    private readonly userWithoutTags: DropdownFacet<TypeSelectNaturalConfiguration> = {
        display: 'Tags exclus',
        field: 'userTags',
        name: 'withoutTags',
        component: TypeNaturalSelectComponent,
        transform: dontHave,
        configuration: {
            service: this.userTagService,
            placeholder: 'Tags',
        },
    };

    private readonly owner: DropdownFacet<TypeSelectNaturalConfiguration> = {
        display: 'Utilisateur',
        field: 'owner',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: this.userService,
            placeholder: 'Utilisateur',
        },
    };

    private readonly productTags: DropdownFacet<TypeSelectNaturalConfiguration> = {
        display: 'Tags',
        field: 'productTags',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: this.productTagService,
            placeholder: 'Tags',
        },
    };

    private readonly userWelcomeSession: FlagFacet = {
        display: 'N\'a pas été accueilli',
        field: 'welcomeSessionDate',
        condition: {null: {}} as UserFilterGroupCondition,
    };

    private readonly productIsActive: FlagFacet = {
        display: 'Actif',
        field: 'isActive',
        condition: {equal: {value: true}} as ProductFilterGroupCondition,
    };

    private readonly product: DropdownFacet<TypeSelectNaturalConfiguration> = {
        display: 'Produit',
        field: 'news.ts',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: this.productService,
            placeholder: 'Produit',
        },
    };

    private readonly code: DropdownFacet<never> = {
        display: 'Code',
        field: 'code',
        component: TypeTextComponent,
        transform: wrapLike,
    };

    private readonly userCode: DropdownFacet<TypeNumberConfiguration> = {
        display: 'Code',
        field: 'code',
        component: TypeNumberComponent,
        configuration: {
            step: 1,
        },
    };

    private readonly firstName: DropdownFacet<never> = {
        display: 'Prénom',
        field: 'firstName',
        component: TypeTextComponent,
        transform: wrapLike,
    };

    private readonly lastName: DropdownFacet<never> = {
        display: 'Nom de famille',
        field: 'lastName',
        component: TypeTextComponent,
        transform: wrapLike,
    };

    private readonly name: DropdownFacet<never> = {
        display: 'Nom',
        field: 'name',
        component: TypeTextComponent,
        transform: wrapLike,
    };

    private readonly creationDate: DropdownFacet<TypeDateConfiguration> = {
        display: 'Date de création',
        field: 'creationDate',
        component: TypeDateComponent,
    };

    private readonly updateDate: DropdownFacet<TypeDateConfiguration> = {
        display: 'Date de modification',
        field: 'updateDate',
        component: TypeDateComponent,
    };

    private readonly allFacets: { [key: string]: NaturalSearchFacets } = {
        usersFrontend: [
            this.userCode,
            this.firstName,
            this.lastName,
            this.userCode,
            this.userTags,
        ],
        usersAdmin: [
            {
                display: 'Login',
                field: 'login',
                component: TypeTextComponent,
                transform: wrapLike,
            } as DropdownFacet<never>,
            this.firstName,
            this.lastName,
            this.userCode,
            {
                display: 'Status',
                field: 'status',
                component: TypeSelectComponent,
                configuration: {
                    items: this.enumService.get('UserStatus'),
                },
            } as DropdownFacet<TypeSelectConfiguration>,
            {
                display: 'Rôle',
                field: 'role',
                component: TypeSelectComponent,
                configuration: {
                    items: this.enumService.get('UserRole'),
                },
            } as DropdownFacet<TypeSelectConfiguration>,
            this.userTags,
            this.userWithNoTags,
            this.userWithoutTags,
            this.userWelcomeSession,
            {
                display: 'Chef de famille',
                field: 'owner',
                component: TypeNaturalSelectComponent,
                configuration: {
                    service: this.userService,
                    placeholder: 'Chef de famille',
                },
            } as DropdownFacet<TypeSelectNaturalConfiguration>,
            this.creationDate,
            this.updateDate,
        ],
        productsAdmin: [
            this.name,
            this.code,
            this.productIsActive,
            this.productTags,
            {
                display: 'Prix de vente (CHF)',
                field: 'pricePerUnitCHF',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Prix de vente (EUR)',
                field: 'pricePerUnitEUR',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Marge de profit',
                field: 'margin',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.1,
                },
                transform: percentage,
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Taux de TVA',
                field: 'vatRate',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.1,
                },
                transform: percentage,
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Fournisseur',
                field: 'supplier',
                component: TypeTextComponent,
                transform: wrapLike,
            } as DropdownFacet<never>,
            {
                display: 'Code produit chez le fournisseur',
                field: 'supplierReference',
                component: TypeTextComponent,
                transform: wrapLike,
            } as DropdownFacet<never>,
            {
                display: 'Prix payé au fournisseur',
                field: 'supplierPrice',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            this.creationDate,
            this.updateDate,
        ],
        orders: [
            {
                display: 'Total (CHF)',
                field: 'balanceCHF',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Total (EUR)',
                field: 'balanceEUR',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            this.owner,
            this.creationDate,
            this.updateDate,
        ],
        orderLines: [
            this.owner,
            {
                display: 'Montant (CHF)',
                field: 'balanceCHF',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Montant (EUR)',
                field: 'balanceEUR',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Quantité',
                field: 'quantity',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            this.creationDate,
        ],
    };

    constructor(
        private readonly enumService: NaturalEnumService,
        private readonly userTagService: UserTagService,
        private readonly productService: ProductService,
        private readonly productTagService: ProductTagService,
        private readonly userService: UserService,
    ) {
    }

    /**
     * Returns the natural search configuration for given, or null if non-existent
     */
    public get(key: string): NaturalSearchFacets | null {
        return this.allFacets[key];
    }

}
