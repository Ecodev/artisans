import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTagByNameResolver } from '../../../admin/product-tags/services/product-tag-by-name.resolver';
import { ProductResolver } from '../../../admin/products/services/product.resolver';
import { ProductsVariables } from '../../../shared/generated-types';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { ProductsPageComponent, ProductsViewMode } from './components/products/products-page.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';

const routes: Routes = [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'articles',
        },
        {
            path: 'recherche',
            component: ProductsPageComponent,
            data: {
                title: 'Résultats la recherche',
                showTags: false,
                viewMode: ProductsViewMode.list,
            },
        },
        {
            path: 'articles',
            component: ProductsPageComponent,
            data: {
                showTags: true,
                viewMode: ProductsViewMode.grid,
                contextVariables: {filter: {groups: [{conditions: [{reviewNumber: {null: {}}}]}]}} as ProductsVariables
            },
        },
        {
            path: 'articles/:productTagName',
            component: ProductsPageComponent,
            resolve: {
                productTag: ProductTagByNameResolver,
            },
            data: {
                showTags: false,
                viewMode: ProductsViewMode.grid,
                contextVariables: {filter: {groups: [{conditions: [{reviewNumber: {null: {}}}]}]}} as ProductsVariables
            },

        },
        {
            path: 'numeros',
            component: ProductsPageComponent,
            data: {
                showTags: false,
                viewMode: ProductsViewMode.list,
                title: 'Tous les numéros',
                contextVariables: {filter: {groups: [{conditions: [{reviewNumber: {null: {not: true}}}]}]}} as ProductsVariables
            },
        },
        {
            path: 'article/:productId',
            component: ProductPageComponent,
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
