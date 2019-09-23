import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormValidators, Literal, NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import {
    CreateStockMovement,
    CreateStockMovementVariables,
    DeleteStockMovements,
    StockMovement,
    StockMovementInput,
    StockMovements,
    StockMovementsVariables,
    StockMovementType,
    StockMovementVariables,
} from '../../../shared/generated-types';
import { UserService } from '../../users/services/user.service';
import { createStockMovement, deleteStockMovements, stockMovementQuery, stockMovementsQuery } from './stockMovement.queries';

@Injectable({
    providedIn: 'root',
})
export class StockMovementService extends NaturalAbstractModelService<StockMovement['stockMovement'],
    StockMovementVariables,
    StockMovements['stockMovements'],
    StockMovementsVariables,
    CreateStockMovement['createStockMovement'],
    CreateStockMovementVariables,
    never,
    never,
    DeleteStockMovements> {

    constructor(apollo: Apollo,
                private userService: UserService,
    ) {
        super(apollo,
            'stockMovement',
            stockMovementQuery,
            stockMovementsQuery,
            createStockMovement,
            null,
            deleteStockMovements);
    }

    protected getDefaultForServer(): StockMovementInput {
        return {
            type: StockMovementType.delivery,
            delta: '0',
            remarks: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            amount: [Validators.min(0)],
        };
    }

    protected getContextForCreation(object): Literal {
        return {product: object.product};
    }
}
