import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventResolver} from '../admin/events/services/event.resolver';
import {NewsResolver} from '../admin/newses/services/news.resolver';
import {ViewerResolver} from '../admin/users/services/viewer.resolver';
import {
    EventSortingField,
    EventsVariables,
    NewsesVariables,
    NewsSortingField,
    SortingOrder,
} from '../shared/generated-types';
import {SEO} from '../shared/services/seo.service';
import {ActionsComponent} from './components/agir-avec-nous/actions/actions.component';
import {AgirAuQuotidienComponent} from './components/agir-avec-nous/agir-au-quotidien/agir-au-quotidien.component';
import {AlimentationComponent} from './components/agir-avec-nous/alimentation/alimentation.component';
import {BnsComponent} from './components/agir-avec-nous/bns/bns.component';
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
import {FaireUnDonComponent} from './components/faire-un-don/faire-un-don.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {LoginComponent} from './components/login/login.component';
import {NewsPageComponent} from './components/news-page/news-page.component';
import {NewsesPageComponent} from './components/newses-page/newses-page.component';
import {PointsDeVenteComponent} from './components/points-de-vente/points-de-vente.component';
import {ProjetComponent} from './components/projet/projet.component';
import {SessionFacilitatorComponent} from './components/session-facilitator/session-facilitator.component';
import {SessionMethodComponent} from './components/session-method/session-method.component';
import {SessionOrganisationComponent} from './components/session-organisation/session-organisation.component';
import {SessionsIncomingComponent} from './components/sessions-incoming/sessions-incoming.component';
import {NousFaireConnaitreComponent} from './components/soutenir/nous-faire-connaitre/nous-faire-connaitre.component';
import {OffrirLaRevueComponent} from './components/soutenir/offrir-la-revue/offrir-la-revue.component';
import {RejoindreAssociationComponent} from './components/soutenir/rejoindre-association/rejoindre-association.component';

const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
    },
    {
        path: 'agenda',
        component: EventsPageComponent,
        data: {
            seo: {title: 'Agenda'} as SEO,
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
            seo: {title: 'Actualités'} as SEO,
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
        path: 'contact',
        component: ContactComponent,
        data: {seo: {title: 'Nous contacter'}},
    },
    {
        path: 'association',
        children: [
            {
                path: 'nos-convictions',
                component: ConvictionsComponent,
                data: {seo: {title: 'Nos convictions'} as SEO},
            },
            {
                path: 'qui-sommes-nous',
                component: QuiSommesNousComponent,
                data: {seo: {title: 'Qui sommes-nous ?'} as SEO},
            },
            {
                path: 'partenariats',
                component: PartenariatsComponent,
                data: {seo: {title: 'Partenariats'} as SEO},
            },
            {
                path: 'status',
                component: ComiteStatusComponent,
                data: {seo: {title: 'Status'} as SEO},
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
                        data: {seo: {title: 'Conversations carbone'} as SEO},
                    },
                    {
                        path: 'facilitateurs',
                        component: SessionFacilitatorComponent,
                        data: {seo: {title: 'Facilitateurs - Conversations carbone'} as SEO},
                    },
                    {
                        path: 'organisations',
                        component: SessionOrganisationComponent,
                        data: {seo: {title: 'Organisateurs - Conversations carbone'} as SEO},
                    },
                    {
                        path: 'prochaines',
                        component: SessionsIncomingComponent,
                        data: {seo: {title: 'Prochaines sessions conversations carbone'} as SEO},
                    },
                    // {
                    //     path: ':sessionId',
                    //     component: SessionPageComponent,
                    //     resolve: {session: SessionResolver},
                    // },
                ],
            },
            {
                path: 'toutes-nos-actions',
                component: ActionsComponent,
                data: {seo: {title: 'Nos actions'} as SEO},
            },
            {
                path: 'calculer-empreinte-carbone',
                component: CalculerEmpreinteCarboneComponent,
                data: {seo: {title: 'Calculer son empreinte carbone'} as SEO},
            },
            {
                path: 'desinvestir-industrie-energies-fossiles',
                component: DesinvestirFossileComponent,
                data: {seo: {title: "Desinvestir de l'industrie des énergies fossiles"} as SEO},
            },
            {
                path: 'rapport-bns',
                component: BnsComponent,
                data: {seo: {title: 'Rapports BNS'} as SEO},
            },
            {
                path: 'numerique-ethique',
                component: NumeriqueEthiqueComponent,
                data: {seo: {title: 'Numérique éthique'} as SEO},
            },
            {
                path: 'alimentation',
                component: AlimentationComponent,
                data: {seo: {title: 'Alimentation'} as SEO},
            },
            {
                path: 'agir-au-quotidien',
                component: AgirAuQuotidienComponent,
                data: {seo: {title: 'Agir au quotidien'} as SEO},
            },
        ],
    },
    {
        path: 'nous-soutenir',
        children: [
            {
                path: 'faire-un-don',
                component: FaireUnDonComponent,
                data: {seo: {title: 'Faire un don'} as SEO},
            },
            {
                path: 'rejoindre-association',
                component: RejoindreAssociationComponent,
                data: {seo: {title: "Rejoindre l'association"} as SEO},
            },
            {
                path: 'offrir-la-revue-durable',
                component: OffrirLaRevueComponent,
                data: {seo: {title: "Offrir ou s'offrir la revue durable"} as SEO},
            },
            {
                path: 'nous-faire-connaitre',
                component: NousFaireConnaitreComponent,
                data: {seo: {title: 'Nous faire connaître'} as SEO},
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
                data: {seo: {title: 'Notre projet'} as SEO},
            },
            {
                path: 'points-de-vente',
                component: PointsDeVenteComponent,
                data: {seo: {title: 'Points de vente'} as SEO},
            },
        ],
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
