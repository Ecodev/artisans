import { Component, OnInit } from '@angular/core';
import { ExpenseClaimService } from '../../../admin/expenseClaim/services/expenseClaim.service';
import {
    AccountingDocumentInput,
    CreateExpenseClaim,
    CreateExpenseClaimVariables,
    ExpenseClaim,
    ExpenseClaimVariables,
    ExpenseClaimStatus,
    UpdateExpenseClaim,
    UpdateExpenseClaimVariables,
} from '../../../shared/generated-types';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../admin/users/services/user.service';
import { AbstractDetail } from '../../../admin/shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { AccountingDocumentService } from './accounting-document.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'app-create-expense-claim',
    templateUrl: './create-expense-claim.component.html',
    styleUrls: ['./create-expense-claim.component.scss'],
})
export class CreateExpenseClaimComponent
    extends AbstractDetail<ExpenseClaim['expenseClaim'],
        ExpenseClaimVariables,
        CreateExpenseClaim['createExpenseClaim'],
        CreateExpenseClaimVariables,
        UpdateExpenseClaim['updateExpenseClaim'],
        UpdateExpenseClaimVariables,
        any> implements OnInit {

    public files: any[] = [null];

    constructor(alertService: AlertService,
                expenseClaimService: ExpenseClaimService,
                router: Router,
                route: ActivatedRoute,
                public userService: UserService,
                public accountingDocumentService: AccountingDocumentService,
    ) {
        super('expenseClaim', expenseClaimService, alertService, router, route);
    }

    ngOnInit() {
        super.ngOnInit();
        this.form.patchValue({
            owner: this.route.snapshot.data.user.model.id,
            status: ExpenseClaimStatus.new,
        });
    }

    public fileAdded(file, index) {
        if (file) {
            this.files[index] = file;
            if (index === this.files.length - 1) {
                this.files.push(null);
            }
        }
    }

    public removeFile(index) {
        this.files.splice(index, 1);
    }

    public trackByFn(index, item) {
        return item ? item.file : index;
    }

    public postCreate(model) {
        const files = this.files.filter(file => !!file);
        if (!files.length) {
            this.router.navigateByUrl('/profile/finances');
        } else {
            const observables: Observable<any>[] = [];
            files.forEach(file => {
                const document: AccountingDocumentInput = {
                    expenseClaim: model.id,
                    file: file.file,
                    owner: this.route.snapshot.data.user.model.id,
                };
                observables.push(this.accountingDocumentService.create(document));
            });

            forkJoin(observables).subscribe(result => {
                this.alertService.info('Votre demande a bien été enregistrée');
                this.router.navigateByUrl('/profile/finances');
            });
        }

    }

}
