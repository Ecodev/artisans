import { TransactionLineQuery, TransactionQuery } from '../../shared/generated-types';

export interface TransactionLineResolve {
    model: TransactionLineQuery['transactionLine'];
}

export interface TransactionResolve {
    model: TransactionQuery['transaction'];
}
