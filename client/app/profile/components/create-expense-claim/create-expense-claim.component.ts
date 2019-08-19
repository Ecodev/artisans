import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { AccountingDocumentsComponent } from '../../../admin/accounting-documents/accounting-documents.component';
import { ExpenseClaimService } from '../../../admin/expenseClaim/services/expenseClaim.service';
import { UserService } from '../../../admin/users/services/user.service';
import {
    CreateExpenseClaim,
    CreateExpenseClaimVariables,
    ExpenseClaim,
    ExpenseClaimStatus,
    ExpenseClaimVariables,
    UpdateExpenseClaim,
    UpdateExpenseClaimVariables,
} from '../../../shared/generated-types';

@Component({
    selector: 'app-create-expense-claim',
    templateUrl: './create-expense-claim.component.html',
    styleUrls: ['./create-expense-claim.component.scss'],
})
export class CreateExpenseClaimComponent
    extends NaturalAbstractDetail<ExpenseClaim['expenseClaim'],
        ExpenseClaimVariables,
        CreateExpenseClaim['createExpenseClaim'],
        CreateExpenseClaimVariables,
        UpdateExpenseClaim['updateExpenseClaim'],
        UpdateExpenseClaimVariables,
        any> implements OnInit {

    @ViewChild(AccountingDocumentsComponent, { static: true }) accountingDocuments: AccountingDocumentsComponent;

    constructor(expenseClaimService: ExpenseClaimService,
                injector: Injector,
                public userService: UserService,
    ) {
        super('expenseClaim', expenseClaimService, injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.form.patchValue({
            owner: this.route.snapshot.data.viewer.model.id,
            status: ExpenseClaimStatus.new,
        });
    }

    public postCreate(model) {
        this.accountingDocuments.save();
        this.router.navigateByUrl('/profile/finances');
        this.alertService.info('Votre demande a bien été enregistrée');
    }

}
