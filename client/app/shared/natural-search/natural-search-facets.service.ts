import { Injectable } from '@angular/core';
import {
    DropdownFacet,
    FlagFacet,
    NaturalEnumService,
    NaturalSearchFacets,
    Selection,
    TypeDateComponent,
    TypeDateConfiguration,
    TypeHierarchicSelectorComponent,
    TypeHierarchicSelectorConfiguration,
    TypeNaturalSelectComponent,
    TypeNumberComponent,
    TypeNumberConfiguration,
    TypeSelectComponent,
    TypeSelectConfiguration,
    TypeSelectNaturalConfiguration,
    TypeTextComponent,
    wrapLike,
} from '@ecodev/natural';
import { ProductService } from '../../admin/products/services/product.service';
import { TransactionService } from '../../admin/transactions/services/transaction.service';
import { UserTagService } from '../../admin/userTags/services/userTag.service';
import { UserFilterGroupCondition } from '../generated-types';
import { ProductTagService } from '../../admin/productTags/services/productTag.service';
import { AccountService } from '../../admin/accounts/services/account.service';
import { AccountHierarchicConfiguration } from '../../admin/AccountHierarchicConfiguration';
import { UserService } from '../../admin/users/services/user.service';

/**
 * Convert percentage for server
 */
function percentage(selection: Selection): Selection {
    Object.keys(selection.condition).forEach(key => {
        if (selection.condition[key].value) {
            selection.condition[key].value = selection.condition[key].value / 100;
        }
    });

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
        field: 'userTags',
        component: TypeNaturalSelectComponent,
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

    private readonly transaction: DropdownFacet<TypeSelectNaturalConfiguration> = {
        display: 'Transaction',
        field: 'transaction',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: this.transactionService,
            placeholder: 'Transaction',
        },
    };

    private readonly product: DropdownFacet<TypeSelectNaturalConfiguration> = {
        display: 'Produit',
        field: 'product',
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
        users: [
            {
                display: 'Login',
                field: 'login',
                component: TypeTextComponent,
                transform: wrapLike,
            } as DropdownFacet<never>,
            {
                display: 'Prénom',
                field: 'firstName',
                component: TypeTextComponent,
                transform: wrapLike,
            } as DropdownFacet<never>,
            {
                display: 'Nom de famille',
                field: 'lastName',
                component: TypeTextComponent,
                transform: wrapLike,
            } as DropdownFacet<never>,
            {
                display: 'Nº coopérateur',
                field: 'code',
                component: TypeTextComponent,
                transform: wrapLike,
            } as DropdownFacet<never>,
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
        transactionLines: [
            this.transaction,
            {
                display: 'Montant',
                field: 'balance',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Compte au débit',
                field: 'debit',
                component: TypeHierarchicSelectorComponent,
                configuration: {
                    key: 'account',
                    service: this.accountService,
                    config: AccountHierarchicConfiguration,
                },
            } as DropdownFacet<TypeHierarchicSelectorConfiguration>,
            {
                display: 'Compte au crédit',
                field: 'credit',
                component: TypeHierarchicSelectorComponent,
                configuration: {
                    key: 'account',
                    service: this.accountService,
                    config: AccountHierarchicConfiguration,
                },
            } as DropdownFacet<TypeHierarchicSelectorConfiguration>,
            {
                display: 'Date de transaction',
                field: 'transactionDate',
                component: TypeDateComponent,
            } as DropdownFacet<TypeDateConfiguration>,
            this.owner,
            this.creationDate,
            this.updateDate,
        ],
        stockMovements: [
            this.product,
            {
                display: 'Mouvement',
                field: 'delta',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.001,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Quantité après mouvement',
                field: 'quantity',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.001,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            {
                display: 'Type',
                field: 'type',
                component: TypeSelectComponent,
                configuration: {
                    items: this.enumService.get('StockMovementType'),
                },
            } as DropdownFacet<TypeSelectConfiguration>,
            this.owner,
            this.creationDate,
        ],
        products: [
            this.name,
            this.code,
            this.productTags,
            {
                display: 'Prix de vente',
                field: 'pricePerUnit',
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
                display: 'Quantité en stock',
                field: 'quantity',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.001,
                },
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
                display: 'Total',
                field: 'balance',
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
                display: 'Montant',
                field: 'balance',
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
        accounts: [
            this.name,
            {
                display: 'Type',
                field: 'type',
                component: TypeSelectComponent,
                configuration: {
                    items: this.enumService.get('AccountType'),
                },
            } as DropdownFacet<TypeSelectConfiguration>,
            {
                display: 'IBAN',
                field: 'iban',
                component: TypeTextComponent,
                transform: wrapLike,
            } as DropdownFacet<never>,
            {
                display: 'Solde',
                field: 'balance',
                component: TypeNumberComponent,
                configuration: {
                    step: 0.01,
                },
            } as DropdownFacet<TypeNumberConfiguration>,
            this.owner,
            this.creationDate,
            this.updateDate,
        ],
        expenseClaims: [
            this.name,
            {
                display: 'Status',
                field: 'status',
                component: TypeSelectComponent,
                configuration: {
                    items: this.enumService.get('ExpenseClaimStatus'),
                },
            } as DropdownFacet<TypeSelectConfiguration>,
            {
                display: 'Type',
                field: 'type',
                component: TypeSelectComponent,
                configuration: {
                    items: this.enumService.get('ExpenseClaimType'),
                },
            } as DropdownFacet<TypeSelectConfiguration>,
            this.owner,
            this.creationDate,
            this.updateDate,

        ],
    };

    constructor(
        private readonly enumService: NaturalEnumService<any>,
        private readonly userTagService: UserTagService,
        private readonly transactionService: TransactionService,
        private readonly productService: ProductService,
        private readonly productTagService: ProductTagService,
        private readonly accountService: AccountService,
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
