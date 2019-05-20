import { Injectable } from '@angular/core';
import {
    DropdownConfiguration,
    NaturalEnumService,
    FlagConfiguration,
    NaturalSearchConfiguration,
    Selection,
    TypeDateRangeComponent,
    TypeDateRangeConfiguration,
    TypeNaturalSelectComponent,
    TypeSelectComponent,
    TypeSelectNaturalConfiguration,
} from '@ecodev/natural';
import { ProductService } from '../../admin/products/services/product.service';
import { TransactionService } from '../../admin/transactions/services/transaction.service';
import { UserTagService } from '../../admin/userTags/services/userTag.service';
import { UserFilterGroupCondition } from '../generated-types';

function wrapLike(s: Selection): Selection {
    if (s.condition.like) {
        s.condition.like.value = '%' + s.condition.like.value + '%';
    }
    return s;
}

/**
 * Replace the operator name (usually "like", "in" or "between") with the
 * attribute "field" or "name" defined in the configuration
 *
 * So:
 *
 *     {field: 'myFieldName', condition: {in: {values: [1, 2, 3]}}}
 *
 * will become
 *
 *     {field: 'myFieldName', condition: {myFieldName: {values: [1, 2, 3]}}}
 */
function replaceOperatorByField(s: Selection, attribute: string = 'field'): Selection {
    const oldOperator = Object.keys(s.condition)[0];

    s.condition[s[attribute]] = s.condition[oldOperator];
    delete s.condition[oldOperator];

    return s;
}

/**
 * Replace the operator name (usually "like", "in" or "between") with the
 * field "name" defined in the configuration
 *
 * So:
 *
 *     {field: 'myFieldName', name:'myConfigName', condition: {in: {values: [1, 2, 3]}}}
 *
 * will become
 *
 *     {field: 'myFieldName',  name:'myConfigName', condition: {myConfigName: {values: [1, 2, 3]}}}
 */
function replaceOperatorByName(s: Selection): Selection {
    return replaceOperatorByField(s, 'name');
}

/**
 * Collection of configuration for natural-search accessible by the object name
 */
@Injectable({
    providedIn: 'root',
})
export class NaturalSearchConfigurationService {

    private readonly userTags: DropdownConfiguration<TypeSelectNaturalConfiguration> = {
        display: 'Tags',
        field: 'userTags',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: this.userTagService,
            placeholder: 'Tags',
        },
    };

    private readonly userWelcomeSession: FlagConfiguration = {
        display: 'N\'a pas été accueilli',
        field: 'welcomeSessionDate',
        condition: {null: {}} as UserFilterGroupCondition
    };

    private readonly transaction: DropdownConfiguration<TypeSelectNaturalConfiguration> = {
        display: 'Transaction',
        field: 'transaction',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: this.transactionService,
            placeholder: 'Transaction',
        },
    };

    private readonly product: DropdownConfiguration<TypeSelectNaturalConfiguration> = {
        display: 'Produit',
        field: 'product',
        component: TypeNaturalSelectComponent,
        configuration: {
            service: this.productService,
            placeholder: 'Produit',
        },
    };

    private readonly creationDate: DropdownConfiguration<TypeDateRangeConfiguration> = {
        display: 'Date',
        field: 'creationDate',
        component: TypeDateRangeComponent,
    };

    private readonly allConfigurations: { [key: string]: NaturalSearchConfiguration } = {
        users: [
            this.userTags,
            this.userWelcomeSession
        ],
        transactionLines: [
            this.transaction,
        ],
        stockMovements: [
            this.product,
            {
                display: 'Type',
                field: 'type',
                component: TypeSelectComponent,
                configuration: {
                    items: this.enumService.get('StockMovementType'),
                },
            },
            this.creationDate,
        ],
    };

    constructor(
        public userTagService: UserTagService,
        private readonly transactionService: TransactionService,
        private readonly productService: ProductService,
        private readonly enumService: NaturalEnumService<any>,
    ) {
    }

    /**
     * Returns the natural search configuration for given, or null if non-existent
     */
    public get(key: string): NaturalSearchConfiguration | null {
        return this.allConfigurations[key];
    }

}
