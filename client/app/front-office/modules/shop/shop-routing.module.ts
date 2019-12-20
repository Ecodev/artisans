import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTagByNameResolver } from '../../../admin/product-tags/services/product-tag-by-name.resolver';
import { ProductResolver } from '../../../admin/products/services/product.resolver';
import { ProductComponent } from './components/product/product.component';
import { ProductsComponent, ProductsViewMode } from './components/products/products.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';

const routes: Routes = [
        {
            path: 'articles',
            component: ProductsComponent,
            data: {
                showTags: true,
                viewMode: ProductsViewMode.grid,
                title: 'Tous les articles de la revue durable',
            },
        },
        {
            path: 'articles/:productTagName',
            component: ProductsComponent,
            resolve: {
                productTag: ProductTagByNameResolver,
            },
            data: {
                showTags: true,
                viewMode: ProductsViewMode.grid,
                title: 'Tous les articles de la revue durable',
            },

        },
        {
            path: 'numeros',
            component: ProductsComponent,
            data: {
                showTags: false,
                viewMode: ProductsViewMode.list,
                title: 'Tous les numéros',
                // contextVariables: // todo : contextualize only numbers.... how to ?
            },
        },
        {
            path: 'product/:productId',
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
