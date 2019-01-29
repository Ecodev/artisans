import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanComponent } from './components/scan/scan.component';
import { BookableComponent } from './bookable/bookable.component';
import { BookableByCodeResolver } from './bookable/bookable-by-code.resolver';
import { CodeInputComponent } from './components/code-input/code-input.component';

const routes: Routes = [
    {
        path: 'by-scan',
        component: ScanComponent,
    },
    {
        path: 'by-code',
        component: CodeInputComponent,
    },
    {
        path: ':bookableCode',
        component: BookableComponent,
        resolve: {
            bookable: BookableByCodeResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BookingRoutingModule {
}
