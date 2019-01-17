import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BookablesComponent } from './bookables/bookables/bookables.component';
import { AdminComponent } from './admin/admin.component';
import { AvatarModule } from 'ngx-avatar';
import { BookableComponent } from './bookables/bookable/bookable.component';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';
import { StampComponent } from './shared/components/stamp/stamp.component';
import { LicensesComponent } from './licenses/licenses/licenses.component';
import { LicenseComponent } from './licenses/license/license.component';
import { UserTagsComponent } from './userTags/userTags/userTags.component';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users/users.component';
import { BookingsComponent } from './bookings/bookings/bookings.component';
import { BookingComponent } from './bookings/booking/booking.component';
import { BookableTagsComponent } from './bookableTags/bookableTags/bookableTags.component';
import { BookableTagComponent } from './bookableTags/bookableTag/bookableTag.component';
import { SidenavModule } from '../shared/modules/sidenav/sidenav.module';
import { DetailHeaderComponent } from '../shared/components/detail-header/detail-header.component';
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { TransactionsComponent } from './transactions/transactions/transactions.component';
import { AccountsComponent } from './accounts/accounts/accounts.component';
import { AccountComponent } from './accounts/account/account.component';
import { ExpenseClaimsComponent } from './expenseClaim/expenseClaims/expenseClaims.component';
import { ExpenseClaimComponent } from './expenseClaim/expenseClaim/expenseClaim.component';
import { CategoriesComponent } from './categories/categories/categories.component';
import { CategoryComponent } from './categories/category/category.component';

@NgModule({
    declarations: [
        BookablesComponent,
        BookableComponent,
        AdminComponent,
        BookingsComponent,
        UsersComponent,
        UserComponent,
        StampComponent,
        LicensesComponent,
        LicenseComponent,
        UserTagsComponent,
        UserTagComponent,
        BookingComponent,
        BookableTagsComponent,
        BookableTagComponent,
        DetailHeaderComponent,
        TransactionComponent,
        TransactionsComponent,
        AccountsComponent,
        AccountComponent,
        ExpenseClaimsComponent,
        ExpenseClaimComponent,
        CategoriesComponent,
        CategoryComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MaterialModule,
        IchtusModule,
        AvatarModule,
        SidenavModule,
    ],
})
export class AdminModule {
}
