import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventResolver} from '../admin/events/services/event.resolver';
import {NewsResolver} from '../admin/newses/services/news.resolver';
import {SessionResolver} from '../admin/sessions/services/session.resolver';
import {ViewerResolver} from '../admin/users/services/viewer.resolver';
import {
    EventSortingField,
    EventsVariables,
    NewsesVariables,
    NewsSortingField,
    SortingOrder,
} from '../shared/generated-types';
import {ActionsComponent} from './components/agir-avec-nous/actions/actions.component';
import {AgirAuQuotidienComponent} from './components/agir-avec-nous/agir-au-quotidien/agir-au-quotidien.component';
import {AlimentationComponent} from './components/agir-avec-nous/alimentation/alimentation.component';
import {CalculerEmpreinteCarboneComponent} from './components/agir-avec-nous/calculer-empreinte-carbone/calculer-empreinte-carbone.component';
import {DesinvestirFossileComponent} from './components/agir-avec-nous/desinvestir-fossile/desinvestir-fossile.component';
import {NumeriqueEthiqueComponent} from './components/agir-avec-nous/numerique-ethique/numerique-ethique.component';
import {ComiteStatusComponent} from './components/association/comite-status/comite-status.component';
import {ConvictionsComponent} from './components/association/convictions/convictions.component';
import {PartenariatsComponent} from './components/association/partenariats/partenariats.component';
import {QuiSommesNousComponent} from './components/association/qui-sommes-nous/qui-sommes-nous.component';
import {ContactComponent} from './components/contact/contact.component';
import {EventPageComponent} from './components/event-page/event-page.component';
import {EventsPageComponent} from './components/events-page/events-page.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {LoginComponent} from './components/login/login.component';
import {NewsPageComponent} from './components/news-page/news-page.component';
import {NewsesPageComponent} from './components/newses-page/newses-page.component';
import {SessionFacilitatorComponent} from './components/session-facilitator/session-facilitator.component';
import {SessionMethodComponent} from './components/session-method/session-method.component';
import {SessionOrganisationComponent} from './components/session-organisation/session-organisation.component';
import {SessionPageComponent} from './components/session-page/session-page.component';
import {SessionsIncomingComponent} from './components/sessions-incoming/sessions-incoming.component';
import {NousFaireConnaitreComponent} from './components/soutenir/nous-faire-connaitre/nous-faire-connaitre.component';
import {OffrirLaRevueComponent} from './components/soutenir/offrir-la-revue/offrir-la-revue.component';
import {RejoindreAssociationComponent} from './components/soutenir/rejoindre-association/rejoindre-association.component';
import {PointsDeVenteComponent} from './la-revue-durable/points-de-vente/points-de-vente.component';
import {ProjetComponent} from './la-revue-durable/projet/projet.component';
import {FaireUnDonComponent} from './nous-soutenir/faire-un-don/faire-un-don.component';

const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
    },
    {
        path: 'agenda',
        component: EventsPageComponent,
        data: {
            breadcrumbs: [{label: "L'association"}],
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
        data: {
            breadcrumbs: [{label: "L'association"}, {link: '/agenda', label: 'Agenda'}],
        },
    },
    {
        path: 'actualite',
        component: NewsesPageComponent,
        data: {
            breadcrumbs: [{label: "L'association"}],
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
        data: {
            breadcrumbs: [{label: "L'association"}, {link: '/actualite', label: 'Actualités'}],
        },
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: {breadcrumbs: [{label: "L'association"}]},
    },
    {
        path: 'association',
        children: [
            {
                path: 'nos-convictions',
                component: ConvictionsComponent,
                data: {breadcrumbs: [{label: "L'association"}]},
            },
            {
                path: 'qui-sommes-nous',
                component: QuiSommesNousComponent,
                data: {breadcrumbs: [{label: "L'association"}]},
            },
            {
                path: 'partenariats',
                component: PartenariatsComponent,
                data: {breadcrumbs: [{label: "L'association"}]},
            },
            {
                path: 'status',
                component: ComiteStatusComponent,
                data: {breadcrumbs: [{label: "L'association"}]},
            },
        ],
    },
    {
        path: 'agir-avec-nous',
        children: [
            {
                path: 'conversation-carbone',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: '/agir-avec-nous/conversation-carbone/methode',
                    },
                    {
                        path: 'methode',
                        component: SessionMethodComponent,
                        data: {
                            breadcrumbs: [{label: 'Agir avec nous'}],
                        },
                    },
                    {
                        path: 'facilitateurs',
                        component: SessionFacilitatorComponent,
                        data: {
                            breadcrumbs: [
                                {label: 'Agir avec nous'},
                                {link: '/agir-avec-nous/conversation-carbone', label: 'Conversations carbone'},
                            ],
                        },
                    },
                    {
                        path: 'organisations',
                        component: SessionOrganisationComponent,
                        data: {
                            breadcrumbs: [
                                {label: 'Agir avec nous'},
                                {link: '/agir-avec-nous/conversation-carbone', label: 'Conversations carbone'},
                            ],
                        },
                    },
                    {
                        path: 'prochaines',
                        component: SessionsIncomingComponent,
                        data: {
                            breadcrumbs: [
                                {label: 'Agir avec nous'},
                                {link: '/agir-avec-nous/conversation-carbone', label: 'Conversations carbone'},
                            ],
                        },
                    },
                    {
                        path: ':sessionId',
                        component: SessionPageComponent,
                        resolve: {session: SessionResolver},
                        data: {
                            breadcrumbs: [
                                {label: 'Agir avec nous'},
                                {
                                    link: '/agir-avec-nous/conversation-carbone/prochaines',
                                    label: 'Conversations carbone',
                                },
                            ],
                        },
                    },
                ],
            },
            {
                path: 'toutes-nos-actions',
                component: ActionsComponent,
                data: {breadcrumbs: [{label: 'Agir avec nous'}]},
            },
            {
                path: 'calculer-empreinte-carbone',
                component: CalculerEmpreinteCarboneComponent,
                data: {breadcrumbs: [{label: 'Agir avec nous'}]},
            },
            {
                path: 'desinvestir-industrie-energies-fossiles',
                component: DesinvestirFossileComponent,
                data: {breadcrumbs: [{label: 'Agir avec nous'}]},
            },
            {
                path: 'numerique-ethique',
                component: NumeriqueEthiqueComponent,
                data: {breadcrumbs: [{label: 'Agir avec nous'}]},
            },
            {
                path: 'alimentation',
                component: AlimentationComponent,
                data: {breadcrumbs: [{label: 'Agir avec nous'}]},
            },
            {
                path: 'agir-au-quotidien',
                component: AgirAuQuotidienComponent,
                data: {breadcrumbs: [{label: 'Agir avec nous'}]},
            },
        ],
    },
    {
        path: 'nous-soutenir',
        children: [
            {
                path: 'faire-un-don',
                component: FaireUnDonComponent,
                data: {breadcrumbs: [{label: 'Nous soutenir'}]},
            },
            {
                path: 'rejoindre-association',
                component: RejoindreAssociationComponent,
                data: {breadcrumbs: [{label: 'Nous soutenir'}]},
            },
            {
                path: 'offrir-la-revue-durable',
                component: OffrirLaRevueComponent,
                data: {breadcrumbs: [{label: 'Nous soutenir'}]},
            },
            {
                path: 'nous-faire-connaitre',
                component: NousFaireConnaitreComponent,
                data: {breadcrumbs: [{label: 'Nous soutenir'}]},
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
        children: [
            {
                path: 'projet',
                component: ProjetComponent,
            },
            {
                path: 'points-de-vente',
                component: PointsDeVenteComponent,
            },
        ],
        data: {breadcrumbs: [{label: 'La Revue Durable'}]},
    },
    {
        path: 'larevuedurable',
        loadChildren: () => import('./modules/shop/shop.module').then(m => m.ShopModule),
    },
    {
        path: 'panier',
        loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FrontOfficeRoutingModule {}
