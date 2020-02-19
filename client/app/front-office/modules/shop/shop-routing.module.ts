import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTagByNameResolver } from '../../../admin/product-tags/services/product-tag-by-name.resolver';
import { ProductResolver } from '../../../admin/products/services/product.resolver';
import { ProductComponent } from './components/product/product.component';
import { ProductsPageComponent, ProductsViewMode } from './components/products/products-page.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';

const routes: Routes = [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'articles',
        },
        {
            path: 'articles',
            component: ProductsPageComponent,
            data: {
                showTags: true,
                viewMode: ProductsViewMode.grid,
            },
        },
        {
            path: 'articles/:productTagName',
            component: ProductsPageComponent,
            resolve: {
                productTag: ProductTagByNameResolver,
            },
            data: {
                showTags: true,
                viewMode: ProductsViewMode.grid,
            },

        },
        {
            path: 'numeros',
            component: ProductsPageComponent,
            data: {
                showTags: false,
                viewMode: ProductsViewMode.list,
                title: 'Tous les numéros',
                // contextVariables: // todo : contextualize only numbers.... how to ?
            },
        },
        {
            path: 'article/:productId',
            component: ProductComponent,
            resolve: {
                product: ProductResolver,
            },
        },
        {
            path: 'abonnements',
            component: SubscriptionsComponent,
        },
    ]
;

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShopRoutingModule {
}
