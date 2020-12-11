import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductTagByNameResolver} from '../../../admin/product-tags/services/product-tag-by-name.resolver';
import {ProductResolver} from '../../../admin/products/services/product.resolver';
import {ProductService} from '../../../admin/products/services/product.service';
import {ProductSortingField, ProductsVariables, SortingOrder} from '../../../shared/generated-types';
import {NaturalSeo} from '@ecodev/natural';
import {ProductPageComponent} from './components/product-page/product-page.component';
import {ProductsPageComponent, ProductsViewMode} from './components/products-page/products-page.component';
import {SubscriptionsComponent} from './components/subscriptions/subscriptions.component';

const routes: Routes = [
    {
        path: 'recherche',
        component: ProductsPageComponent,
        data: {
            seo: {title: 'Résultats de la recherche'} as NaturalSeo,
            showNoResults: true,
            showTagsOnProducts: false,
            showTagsNavigation: false,
            viewMode: ProductsViewMode.list,
            showMoreLabel: 'Afficher plus de résultats',
            forcedVariables: {
                sorting: [{field: ProductSortingField.creationDate, order: SortingOrder.DESC}],
            } as ProductsVariables,
        },
    },
    {
        path: 'articles',
        component: ProductsPageComponent,
        data: {
            seo: {title: 'Tous les articles'} as NaturalSeo,
            showTagsOnProducts: true,
            showTagsNavigation: true,
            viewMode: ProductsViewMode.grid,
            showMoreLabel: "Afficher plus d'articles",
            forcedVariables: {
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
            seo: {resolveKey: 'productTag'} as NaturalSeo,
            breadcrumbs: [
                {link: '/larevuedurable', label: 'La Revue Durable'},
                {link: '/larevuedurable/articles', label: 'Articles'},
            ],
            showTagsOnProducts: false,
            showTagsNavigation: false,
            viewMode: ProductsViewMode.grid,
            showMoreLabel: "Afficher plus d'articles",
            forcedVariables: {
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
            seo: {title: 'Tous les numéros'} as NaturalSeo,
            showTagsOnProducts: false,
            showTagsNavigation: false,
            viewMode: ProductsViewMode.list,
            title: 'Tous les numéros',
            showMoreLabel: 'Afficher plus de numéros',
            forcedVariables: {
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
            seo: {
                resolveKey: 'product',
            } as NaturalSeo,
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
            seo: {
                resolveKey: 'product',
            } as NaturalSeo,
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
            seo: {
                title: 'Abonnements',
                description:
                    'Plus de 1000 articles de fond sur tous les thèmes qui touchent à la durabilité dans une soixantaine de pays. LaRevueDurable constitue l’une des plus importantes base de données disponibles sur la durabilité et la transition écologique en français.',
            } as NaturalSeo,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShopRoutingModule {}
