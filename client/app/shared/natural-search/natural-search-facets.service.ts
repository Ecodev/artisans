import {Injectable} from '@angular/core';
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
import {ProductTagService} from '../../admin/product-tags/services/product-tag.service';
import {ProductService} from '../../admin/products/services/product.service';
import {UserService} from '../../admin/users/services/user.service';
import {ProductFilterGroupCondition, UserFilterGroupCondition} from '../generated-types';

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

    private readonly productIsActive: FlagFacet = {
        display: 'Actif',
        field: 'isActive',
        condition: {equal: {value: true}} as ProductFilterGroupCondition,
    };

    private readonly productHasNoFile: FlagFacet = {
        display: 'Sans produit dématérialisé',
        field: 'file',
        condition: {empty: {not: false}} as ProductFilterGroupCondition,
    };

    private readonly code: DropdownFacet<never> = {
        display: 'Code',
        field: 'code',
        component: TypeTextComponent,
        transform: wrapLike,
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

    private readonly allFacets: {[key: string]: NaturalSearchFacets} = {
        users: [
            {
                display: 'Existe pas dans Crésus',
                field: 'shouldDelete',
                condition: {equal: {value: true}} as UserFilterGroupCondition,
            } as FlagFacet,
            this.firstName,
            this.lastName,
            {
                display: 'Rôle',
                field: 'role',
                component: TypeSelectComponent,
                configuration: {
                    items: this.enumService.get('UserRole'),
                },
            } as DropdownFacet<TypeSelectConfiguration>,
            this.creationDate,
            this.updateDate,
        ],
        productsAdmin: [
            this.name,
            this.code,
            this.productIsActive,
            this.productTags,
            {
                display: 'Type',
                field: 'type',
                component: TypeSelectComponent,
                configuration: {
                    items: this.enumService.get('ProductType'),
                },
            } as DropdownFacet<TypeSelectConfiguration>,
            {
                display: 'Prix CHF',
                field: 'pricePerUnitCHF',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Prix EUR',
                field: 'pricePerUnitEUR',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            this.productHasNoFile,
            this.creationDate,
            this.updateDate,
        ],
        orders: [
            {
                display: 'Total CHF',
                field: 'balanceCHF',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Total EUR',
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
                display: 'Montant CHF',
                field: 'balanceCHF',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Montant EUR',
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
        sessions: [
            {
                display: "Date d'appel à contribution",
                field: 'endDate',
                component: TypeDateComponent,
            },
            {
                display: 'Facilitateur',
                field: 'facilitators',
                component: TypeNaturalSelectComponent,
                configuration: {
                    service: this.userService,
                    placeholder: 'Facilitateur',
                },
            },
        ],
    };

    constructor(
        private readonly enumService: NaturalEnumService,
        private readonly productService: ProductService,
        private readonly productTagService: ProductTagService,
        private readonly userService: UserService,
    ) {}

    /**
     * Returns the natural search configuration for given, or null if non-existent
     */
    public get(key: string): NaturalSearchFacets {
        return this.allFacets[key] || [];
    }
}
