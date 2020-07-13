import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductTagByNameResolver} from '../../../admin/product-tags/services/product-tag-by-name.resolver';
import {ProductResolver} from '../../../admin/products/services/product.resolver';
import {ProductService} from '../../../admin/products/services/product.service';
import {ProductSortingField, ProductsVariables, SortingOrder} from '../../../shared/generated-types';
import {SEO} from '../../../shared/services/seo.service';
import {ProductPageComponent} from './components/product-page/product-page.component';
import {ProductsPageComponent, ProductsViewMode} from './components/products-page/products-page.component';
import {SubscriptionsComponent} from './components/subscriptions/subscriptions.component';

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
            seo: {title: 'Résultats de la recherche'} as SEO,
            title: 'Résultats la recherche',
            showNoResults: true,
            showTagsOnProducts: false,
            showTagsNavigation: false,
            viewMode: ProductsViewMode.list,
        },
    },
    {
        path: 'articles',
        component: ProductsPageComponent,
        data: {
            seo: {title: 'Tous les articles'},
            showTagsOnProducts: true,
            showTagsNavigation: true,
            viewMode: ProductsViewMode.grid,
            contextVariables: {
                filter: {
                    groups: [
                        {
                            conditions: [
                                {
                                    review: {null: {not: true}},
                                    isActive: {equal: {value: true}},
                                },
                            ],
                        },
                    ],
                },
                sorting: ProductService.articlesSorting,
            } as ProductsVariables,
        },
    },
    {
        path: 'articles/:productTagName',
        component: ProductsPageComponent,
        resolve: {productTag: ProductTagByNameResolver},
        data: {
            breadcrumbs: [
                {link: '/larevuedurable', label: 'La Revue Durable'},
                {link: '/larevuedurable/articles', label: 'Articles'},
            ],
            showTagsOnProducts: false,
            showTagsNavigation: false,
            viewMode: ProductsViewMode.grid,
            contextVariables: {
                filter: {
                    groups: [
                        {
                            conditions: [
                                {
                                    review: {null: {not: true}},
                                    isActive: {equal: {value: true}},
                                },
                            ],
                        },
                    ],
                },
                sorting: ProductService.articlesSorting,
            } as ProductsVariables,
        },
    },
    {
        path: 'numeros',
        component: ProductsPageComponent,
        data: {
            seo: {title: 'Tous les numéros'},
            showTagsOnProducts: false,
            showTagsNavigation: false,
            viewMode: ProductsViewMode.list,
            title: 'Tous les numéros',
            contextVariables: {
                filter: {
                    groups: [
                        {
                            conditions: [
                                {
                                    reviewNumber: {null: {not: true}},
                                    isActive: {equal: {value: true}},
                                },
                            ],
                        },
                    ],
                },
                sorting: [{field: ProductSortingField.releaseDate, order: SortingOrder.DESC}],
            } as ProductsVariables,
        },
    },
    {
        path: 'article/:productId',
        component: ProductPageComponent,
        resolve: {product: ProductResolver},
        data: {
            showTagsOnProducts: true,
            showTagsNavigation: false,
            breadcrumbs: [
                {link: '/larevuedurable', label: 'La Revue Durable'},
                {link: '/larevuedurable/articles', label: 'Articles'},
            ],
        },
    },
    {
        path: 'numero/:productId',
        component: ProductPageComponent,
        resolve: {product: ProductResolver},
        data: {
            showTagsOnProducts: true,
            showTagsNavigation: false,
            breadcrumbs: [
                {link: '/larevuedurable', label: 'La Revue Durable'},
                {link: '/larevuedurable/numeros', label: 'Numéros'},
            ],
        },
    },
    {
        path: 'abonnements',
        component: SubscriptionsComponent,
        data: {
            seo: {title: 'Abonnements'},
            breadcrumbs: [{label: 'La Revue Durable'}],
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShopRoutingModule {}
