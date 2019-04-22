import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ProductsComponent } from './products/products/products.component';
import { AdminComponent } from './admin/admin.component';
import { AvatarModule } from 'ngx-avatar';
import { ProductComponent } from './products/product/product.component';
import { MaterialModule } from '../shared/modules/material.module';
import { EmmyModule } from '../shared/modules/emmy.module';
import { UserTagsComponent } from './userTags/userTags/userTags.component';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users/users.component';
import { ProductTagsComponent } from './productTags/productTags/productTags.component';
import { ProductTagComponent } from './productTags/productTag/productTag.component';
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { AccountsComponent } from './accounts/accounts/accounts.component';
import { AccountComponent } from './accounts/account/account.component';
import { ExpenseClaimsComponent } from './expenseClaim/expenseClaims/expenseClaims.component';
import { ExpenseClaimComponent } from './expenseClaim/expenseClaim/expenseClaim.component';
import { TransactionTagsComponent } from './transactionTags/transactionTags/transactionTags.component';
import { TransactionTagComponent } from './transactionTags/transactionTag/transactionTag.component';
import { TransactionLinesComponent } from './transactions/transactionLines/transactionLines.component';
import { EditableTransactionLinesComponent } from './transactions/editable-transaction-lines/editable-transaction-lines.component';
import { SelectAdminOnlyModalComponent } from '../shared/components/select-admin-only-modal/select-admin-only-modal.component';
import { ProfileModule } from '../profile/profile.module';
import { ProductMetadataComponent } from './product-metadata/product-metadata.component';

@NgModule({
    declarations: [
        ProductsComponent,
        ProductComponent,
        AdminComponent,
        UsersComponent,
        UserComponent,
        UserTagsComponent,
        UserTagComponent,
        ProductTagsComponent,
        ProductTagComponent,
        TransactionComponent,
        TransactionLinesComponent,
        AccountsComponent,
        AccountComponent,
        ExpenseClaimsComponent,
        ExpenseClaimComponent,
        TransactionTagsComponent,
        TransactionTagComponent,
        EditableTransactionLinesComponent,
        SelectAdminOnlyModalComponent,
        ProductMetadataComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MaterialModule,
        EmmyModule,
        AvatarModule,
        ProfileModule,
    ],
    entryComponents: [
        SelectAdminOnlyModalComponent,
    ],
})
export class AdminModule {
}
