import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventResolver } from '../admin/events/services/event.resolver';
import { NewsResolver } from '../admin/newses/services/news.resolver';
import { SessionResolver } from '../admin/sessions/services/session.resolver';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { EventSortingField, EventsVariables, NewsesVariables, NewsSortingField, SortingOrder } from '../shared/generated-types';
import { EventPageComponent } from './components/event-page/event-page.component';
import { EventsPageComponent } from './components/events-page/events-page.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { NewsPageComponent } from './components/news-page/news-page.component';
import { NewsesPageComponent } from './components/newses-page/newses-page.component';
import { NextSessionsComponent } from './components/next-sessions/next-sessions.component';
import { SessionPageComponent } from './components/session-page/session-page.component';

const routes: Routes = [
        {
            path: '',
            component: HomepageComponent,
        },
        {
            path: 'agenda',
            component: EventsPageComponent,
            data: {
                contextVariables: {
                    filter: {groups: [{conditions: [{date: {greaterOrEqual: {value: new Date()}}}]}]},
                    sorting: [{field: EventSortingField.date, order: SortingOrder.ASC}],
                } as EventsVariables,
            },
        },
        {
            path: 'agenda/:eventId',
            component: EventPageComponent,
            resolve: {event: EventResolver},
        },
        {
            path: 'actualite',
            component: NewsesPageComponent,
            data: {
                contextVariables: {
                    filter: {groups: [{conditions: [{date: {less: {value: new Date()}}}]}]},
                    sorting: [{field: NewsSortingField.date, order: SortingOrder.DESC}],
                } as NewsesVariables,
            },
        },
        {
            path: 'actualite/:newsId',
            component: NewsPageComponent,
            resolve: {news: NewsResolver},
        },
        {
            path: 'agir-avec-nous',
            children: [
                {
                    path: 'prochaines-conversations-carbone',
                    component: NextSessionsComponent,
                },
                {
                    path: 'prochaines-conversations-carbone/:region',
                    component: NextSessionsComponent,
                },
                {
                    path: 'conversation-carbone/:sessionId',
                    component: SessionPageComponent,
                    resolve: {session: SessionResolver},
                },
            ],
        },
        {
            path: 'login',
            component: LoginComponent,
            resolve: {viewer: ViewerResolver},
        },
        {
            path: 'mon-compte',
            loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule),
        },
        {
            path: 'larevuedurable',
            loadChildren: () => import('./modules/shop/shop.module').then(m => m.ShopModule),
        },
        {
            path: 'panier',
            loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule),
        },
    ]
;

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FrontOfficeRoutingModule {
}
