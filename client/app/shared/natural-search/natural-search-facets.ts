import {assertInInjectionContext, inject} from '@angular/core';
import {
    DropdownFacet,
    FlagFacet,
    NaturalEnumService,
    NaturalSearchFacets,
    replaceOperatorByName,
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
import {UserService} from '../../admin/users/services/user.service';
import {
    ProductFilterGroupConditionFile,
    ProductFilterGroupConditionIsActive,
    UserFilterGroupConditionShouldDelete,
    UserFilterGroupConditionSubscriptionLastReview,
} from '../generated-types';

function owner(): DropdownFacet<TypeSelectNaturalConfiguration<UserService>> {
    return {
        display: 'Utilisateur',
        field: 'owner',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: inject(UserService),
            placeholder: 'Utilisateur',
        },
    };
}

function productTags(): DropdownFacet<TypeSelectNaturalConfiguration<ProductTagService>> {
    return {
        display: 'Tags',
        field: 'productTags',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: inject(ProductTagService),
            placeholder: 'Tags',
        },
    };
}

const productIsActive: FlagFacet<ProductFilterGroupConditionIsActive> = {
    display: 'Actif',
    field: 'isActive',
    condition: {equal: {value: true}},
};

const productIsNotActive: FlagFacet<ProductFilterGroupConditionIsActive> = {
    display: 'Non actif',
    field: 'isActive',
    name: 'isNotActive',
    condition: {equal: {value: false}},
};

const productHasNoFile: FlagFacet<ProductFilterGroupConditionFile> = {
    display: 'Sans produit dématérialisé',
    field: 'file',
    condition: {empty: {not: false}},
};

const code: DropdownFacet<never> = {
    display: 'Code',
    field: 'code',
    component: TypeTextComponent,
    transform: wrapLike,
};

const firstName: DropdownFacet<never> = {
    display: 'Prénom',
    field: 'firstName',
    component: TypeTextComponent,
    transform: wrapLike,
};

const lastName: DropdownFacet<never> = {
    display: 'Nom de famille',
    field: 'lastName',
    component: TypeTextComponent,
    transform: wrapLike,
};

const name: DropdownFacet<never> = {
    display: 'Nom',
    field: 'name',
    component: TypeTextComponent,
    transform: wrapLike,
};

const creationDate: DropdownFacet<TypeDateConfiguration> = {
    display: 'Date de création',
    field: 'creationDate',
    component: TypeDateComponent,
};

const updateDate: DropdownFacet<TypeDateConfiguration> = {
    display: 'Date de modification',
    field: 'updateDate',
    component: TypeDateComponent,
};

export function users(): NaturalSearchFacets {
    assertInInjectionContext(users);

    return [
        {
            display: 'Existe pas dans Crésus',
            field: 'shouldDelete',
            condition: {equal: {value: true}},
        } satisfies FlagFacet<UserFilterGroupConditionShouldDelete>,
        {
            display: 'Liste de bénéficiaires',
            field: 'custom',
            component: TypeTextComponent,
            name: 'regexp',
            transform: replaceOperatorByName,
        } satisfies DropdownFacet<never>,
        firstName,
        lastName,
        {
            display: 'Membre des artisans',
            field: 'membership',
            component: TypeSelectComponent,
            configuration: {
                items: inject(NaturalEnumService).get('Membership'),
            },
        } satisfies DropdownFacet<TypeSelectConfiguration>,
        {
            display: 'Abonné',
            field: 'subscriptionLastReview',
            condition: {empty: {not: true}},
        } satisfies FlagFacet<UserFilterGroupConditionSubscriptionLastReview>,
        {
            display: 'Non abonné',
            field: 'subscriptionLastReview',
            name: 'noSubscriptionLastReview',
            condition: {empty: {not: false}},
        } satisfies FlagFacet<UserFilterGroupConditionSubscriptionLastReview>,
        {
            display: 'Rôle',
            field: 'role',
            component: TypeSelectComponent,
            configuration: {
                items: inject(NaturalEnumService).get('UserRole'),
            },
        } satisfies DropdownFacet<TypeSelectConfiguration>,
        creationDate,
        updateDate,
    ];
}

export function productsAdmin(): NaturalSearchFacets {
    assertInInjectionContext(productsAdmin);

    return [
        name,
        code,
        productIsActive,
        productIsNotActive,
        productTags(),
        {
            display: 'Type',
            field: 'type',
            component: TypeSelectComponent,
            configuration: {
                items: inject(NaturalEnumService).get('ProductType'),
            },
        } satisfies DropdownFacet<TypeSelectConfiguration>,
        {
            display: 'Prix CHF',
            field: 'pricePerUnitCHF',
            component: TypeNumberComponent,
            configuration: {
                step: 0.01,
            },
        } satisfies DropdownFacet<TypeNumberConfiguration>,
        {
            display: 'Prix EUR',
            field: 'pricePerUnitEUR',
            component: TypeNumberComponent,
            configuration: {
                step: 0.01,
            },
        } satisfies DropdownFacet<TypeNumberConfiguration>,
        productHasNoFile,
        creationDate,
        updateDate,
    ];
}

export function orders(): NaturalSearchFacets {
    assertInInjectionContext(orders);

    return [
        {
            display: 'Total CHF',
            field: 'balanceCHF',
            component: TypeNumberComponent,
            configuration: {
                step: 0.01,
            },
        } satisfies DropdownFacet<TypeNumberConfiguration>,
        {
            display: 'Total EUR',
            field: 'balanceEUR',
            component: TypeNumberComponent,
            configuration: {
                step: 0.01,
            },
        } satisfies DropdownFacet<TypeNumberConfiguration>,
        {
            display: 'État',
            field: 'status',
            component: TypeSelectComponent,
            configuration: {
                items: inject(NaturalEnumService).get('OrderStatus'),
            },
        } satisfies DropdownFacet<TypeSelectConfiguration>,
        owner(),
        creationDate,
        updateDate,
    ];
}

export function orderLines(): NaturalSearchFacets {
    assertInInjectionContext(orderLines);

    return [
        owner(),
        {
            display: 'Montant CHF',
            field: 'balanceCHF',
            component: TypeNumberComponent,
            configuration: {
                step: 0.01,
            },
        } satisfies DropdownFacet<TypeNumberConfiguration>,
        {
            display: 'Montant EUR',
            field: 'balanceEUR',
            component: TypeNumberComponent,
            configuration: {
                step: 0.01,
            },
        } satisfies DropdownFacet<TypeNumberConfiguration>,
        {
            display: 'Quantité',
            field: 'quantity',
            component: TypeNumberComponent,
            configuration: {
                step: 0.01,
            },
        } satisfies DropdownFacet<TypeNumberConfiguration>,
        creationDate,
    ];
}

export function sessions(): NaturalSearchFacets {
    assertInInjectionContext(sessions);

    return [
        {
            display: "Date d'appel à contribution",
            field: 'endDate',
            component: TypeDateComponent,
        } satisfies DropdownFacet<TypeDateConfiguration>,
        {
            display: 'Facilitateur',
            field: 'facilitators',
            component: TypeNaturalSelectComponent,
            configuration: {
                service: inject(UserService),
                placeholder: 'Facilitateur',
            },
        } satisfies DropdownFacet<TypeSelectNaturalConfiguration<UserService>>,
    ];
}
