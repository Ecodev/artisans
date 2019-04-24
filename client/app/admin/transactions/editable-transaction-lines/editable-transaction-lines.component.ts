import { Component, Input, OnInit } from '@angular/core';
import { TransactionLineService } from '../services/transactionLine.service';
import { ProductService } from '../../products/services/product.service';
import { Transaction, TransactionLinesVariables } from '../../../shared/generated-types';
import { TransactionTagService } from '../../transactionTags/services/transactionTag.service';
import { NaturalAbstractEditableList } from '@ecodev/natural';
import { AccountHierarchicConfiguration } from '../../AccountHierarchicConfiguration';

@Component({
    selector: 'app-editable-transaction-lines',
    templateUrl: './editable-transaction-lines.component.html',
    styleUrls: ['./editable-transaction-lines.component.scss'],
})
export class EditableTransactionLinesComponent extends NaturalAbstractEditableList<any, any> implements OnInit {

    @Input() transaction: Transaction['transaction'];

    public accountHierarchicConfig = AccountHierarchicConfiguration;
    public columns = ['isReconciled', 'name', 'balance', 'debit', 'credit',  'product', 'transactionTag', 'remarks', 'remove'];

    constructor(private transactionLineService: TransactionLineService,
                public transactionTagService: TransactionTagService,
                public productService: ProductService) {
        super('transactionLine', transactionLineService);
    }

    ngOnInit() {
        super.ngOnInit();

        if (this.transaction && this.transaction.id) {

            this.variablesManager.set('variables', {
                filter: {groups: [{conditions: [{transaction: {equal: {value: this.transaction.id}}}]}]},
            } as TransactionLinesVariables);

            // TODO : Replace getAll by watchAll
            this.service.getAll(this.variablesManager).subscribe(results => {
                this.add(results);
            });
        } else {
            this.addEmpty();
        }
    }

}
