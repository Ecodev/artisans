import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {formatIsoDate, formatIsoDateTime, NaturalSeo} from '@ecodev/natural';
import {resolveEvent} from '../admin/events/services/event.resolver';
import {resolveNews} from '../admin/newses/services/news.resolver';
import {resolveViewer} from '../admin/users/services/viewer.resolver';
import {ErrorComponent} from '../shared/components/error/error.component';
import {
    EventSortingField,
    EventsVariables,
    NewsesVariables,
    NewsSortingField,
    SortingOrder,
} from '../shared/generated-types';
import {canActivateFacilitator} from '../shared/guards/facilitator.guard';
import {ActionsComponent} from './components/agir-avec-nous/actions/actions.component';
import {AgirAuQuotidienComponent} from './components/agir-avec-nous/agir-au-quotidien/agir-au-quotidien.component';
import {AlimentationComponent} from './components/agir-avec-nous/alimentation/alimentation.component';
import {AperoDivestComponent} from './components/agir-avec-nous/apero-divest/apero-divest.component';
import {BnsComponent} from './components/agir-avec-nous/bns/bns.component';
import {DesinvestirFossileComponent} from './components/agir-avec-nous/desinvestir-fossile/desinvestir-fossile.component';
import {NumeriqueEthiqueComponent} from './components/agir-avec-nous/numerique-ethique/numerique-ethique.component';
import {ComiteStatusComponent} from './components/association/comite-status/comite-status.component';
import {ConvictionsComponent} from './components/association/convictions/convictions.component';
import {PartenariatsComponent} from './components/association/partenariats/partenariats.component';
import {QuiSommesNousComponent} from './components/association/qui-sommes-nous/qui-sommes-nous.component';
import {CircuitsCourtsComponent} from './components/circuits-courts/circuits-courts.component';
import {ConditionsGeneralesVenteComponent} from './components/conditions-generales-vente/conditions-generales-vente.component';
import {ContactComponent} from './components/contact/contact.component';
import {EventPageComponent} from './components/event-page/event-page.component';
import {EventsPageComponent} from './components/events-page/events-page.component';
import {FaireUnDonComponent} from './components/faire-un-don/faire-un-don.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {LegalMentionsComponent} from './components/legal-mentions/legal-mentions.component';
import {LoginComponent} from './components/login/login.component';
import {NewsPageComponent} from './components/news-page/news-page.component';
import {NewsesPageComponent} from './components/newses-page/newses-page.component';
import {PointsDeVenteComponent} from './components/points-de-vente/points-de-vente.component';
import {ProjetComponent} from './components/projet/projet.component';
import {SessionFacilitatorPrivateComponent} from './components/session-facilitator-private/session-facilitator-private.component';
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
            seo: {title: 'Agenda'} satisfies NaturalSeo,
            forcedVariables: {
                filter: {
                    groups: [
                        {
                            conditions: [
                                {
                                    date: {
                                        greaterOrEqual: {
                                            value: formatIsoDate(new Date()),
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                sorting: [{field: EventSortingField.date, order: SortingOrder.ASC}],
            } satisfies EventsVariables,
        },
    },
    {
        path: 'agenda/:eventId',
        component: EventPageComponent,
        resolve: {event: resolveEvent},
        data: {
            seo: {resolveKey: 'event'} satisfies NaturalSeo,
        },
    },
    {
        path: 'actualite',
        component: NewsesPageComponent,
        data: {
            seo: {title: 'Actualités'} satisfies NaturalSeo,
            forcedVariables: {
                filter: {groups: [{conditions: [{date: {less: {value: formatIsoDateTime(new Date())}}}]}]},
                sorting: [{field: NewsSortingField.date, order: SortingOrder.DESC}],
            } satisfies NewsesVariables,
        },
    },
    {
        path: 'actualite/:newsId',
        component: NewsPageComponent,
        resolve: {news: resolveNews},
        data: {
            seo: {resolveKey: 'news'} satisfies NaturalSeo,
        },
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: {seo: {title: 'Nous contacter'} satisfies NaturalSeo},
    },
    {
        path: 'association',
        children: [
            {
                path: 'nos-convictions',
                component: ConvictionsComponent,
                data: {
                    seo: {
                        title: 'Nos convictions',
                        description:
                            'La volonté de l’association Artisans de la transition est de créer un maximum d’opportunités pour aider à agir afin de créer une société soutenable.',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'qui-sommes-nous',
                component: QuiSommesNousComponent,
                data: {
                    seo: {
                        title: 'Qui sommes-nous ?',
                        description:
                            'Une petite équipe motivée et compétente qui s’efforce chaque jour de mettre leurs actes en cohérence avec leurs idées et leurs convictions.',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'partenariats',
                component: PartenariatsComponent,
                data: {
                    seo: {
                        title: 'Partenariats',
                        description:
                            'Les Artisans de la transition sont partenaires officiels de la Plateforme Développement durable des hautes écoles de la HES-SO. Elle est aussi partenaire du Cas développement durable de l’Université de Genève, de l’Hepia et de l’association Tera en France. ',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'statuts',
                component: ComiteStatusComponent,
                data: {
                    seo: {
                        title: 'Statuts',
                        description:
                            'Président : Yvan Maillard Ardenti pilote le programme « Justice climatique » à la fondation Pain pour le prochain. Secrétaire : Jacques Eschmann, géographe. Membres du comité : Daniel Chambaz, Pietro Majno, Aurianne Stroude et Berthe d’Arras.',
                    } satisfies NaturalSeo,
                },
            },
        ],
    },
    {
        path: 'agir-avec-nous',
        resolve: {viewer: resolveViewer},
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
                            seo: {
                                title: 'Conversations carbone',
                                description:
                                    'Depuis 2017, plus de 400 personnes ont participé à une Conversation carbone en Suisse romande. En moyenne, 80 % d’entre elles estiment que cette expérience les a motivées à modifier leur comportement, 70 % ont augmenté leurs connaissances.',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: 'facilitateurs',
                        component: SessionFacilitatorComponent,
                        data: {
                            seo: {
                                title: 'Facilitateurs - Conversations carbone',
                                description:
                                    'Si vous aimez le contact, faites preuve d’empathie et d’écoute non jugeante et avez envie de vous engager pour le climat, nous vous proposons de devenir facilitateur.trice de Conversations carbone. ',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: 'facilitateurs-prive',
                        component: SessionFacilitatorPrivateComponent,
                        canActivate: [canActivateFacilitator],
                        data: {seo: {title: 'Facilitateurs - Conversations carbone'} satisfies NaturalSeo},
                    },
                    {
                        path: 'organisations',
                        component: SessionOrganisationComponent,
                        data: {
                            seo: {
                                title: 'Organisateurs - Conversations carbone',
                                description:
                                    'Organiser une Conversations Carbone en entreprise ou association est tout à fait possible et même recommandable. ',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: 'prochaines',
                        component: SessionsIncomingComponent,
                        data: {
                            seo: {
                                title: 'Prochaines sessions conversations carbone',
                                description:
                                    'Les Conversations carbone se tiennent régulièrement en Suisse romande. Si vous n’avez pas trouvé de session qui vous convienne, n’hésitez pas à vous inscrire sur l’une des listes d’attente régionales.',
                            } satisfies NaturalSeo,
                        },
                    },
                    // {
                    //     path: ':sessionId',
                    //     component: SessionPageComponent,
                    //     resolve: {session: resolveSession},
                    // },
                ],
            },
            {
                path: 'toutes-nos-actions',
                component: ActionsComponent,
                data: {
                    seo: {
                        title: 'Nos actions',
                        description:
                            'Les actions de l’association sont structurées en trois axes selon une logique progressive. On commence par s’informer, puis on se sent concerné au point de vouloir s’impliquer, et on se met à agir.',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'desinvestir',
                children: [
                    {
                        path: '',
                        redirectTo: 'desinvestir/industrie-energies-fossiles',
                        pathMatch: 'full',
                    },
                    {
                        path: 'industrie-energies-fossiles',
                        component: DesinvestirFossileComponent,
                        data: {
                            seo: {
                                title: "Desinvestir de l'industrie des énergies fossiles",
                                description:
                                    'Les Artisans de la transition animent la campagne de désinvestissement des énergies fossiles. Elle est particulièrement pertinente en Suisse, au 70e rang en termes d’émissions directes de CO2, au 7e rang en termes d’émissions générées par sa place financière.',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: 'atelier-finance',
                        component: AperoDivestComponent,
                        data: {
                            seo: {
                                title: 'atelier-finance',
                                description:
                                    'Le principe de l’atelier finance est très simple : vous réunissez une dizaine de personnes en cercle sans rien au centre dans votre salon et faites appel à un ou deux facilitateurs ou facilitatrices formé-e-s par les Artisans de la transition pour assurer l’animation.',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: 'rapport-bns',
                        component: BnsComponent,
                        data: {
                            seo: {
                                title: 'Rapports BNS',
                                description:
                                    'Depuis 2016, l’association a publié trois rapports sur les investissements de la Banque Nationale Suisse dans l’industrie des énergies fossiles, dont les deux premiers ont donné lieu à de nombreuses motions parlementaires, y compris au niveau fédéral.',
                            } satisfies NaturalSeo,
                        },
                    },
                ],
            },
            {
                path: 'numerique-ethique',
                component: NumeriqueEthiqueComponent,
                data: {
                    seo: {
                        title: 'Numérique éthique',
                        description:
                            'En janvier 2019, un livre extraordinaire est paru aux Etats-Unis. Son autrice, Shoshana Zuboff, y dévoile avec maestria la façon dont Google, puis Facebook, la Silicon Valley et enfin l’ensemble du tissu économique bouleversent le capitalisme depuis 2001.',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'alimentation',
                component: AlimentationComponent,
                data: {
                    seo: {
                        title: 'Alimentation',
                        description:
                            'Les Artisans de la transition veulent dynamiser la transition agroécologique et paysanne en tissant des liens entre ces acteurs, en soutenant leurs actions, en augmentant leur nombre et leur poids politique pour, in fine, œuvrer à un changement du système alimentaire.',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'agir-au-quotidien',
                component: AgirAuQuotidienComponent,
                data: {
                    seo: {
                        title: 'Agir au quotidien',
                        description:
                            'Au gré des parutions de LaRevueDurable, ce site propose des pistes d’action au quotidien. Pour l’instant, nous vous proposons d’agir sur le numérique éthique et de capitaliser sur les changements de comportement que vous avez adopté pendant le confinement. ',
                    } satisfies NaturalSeo,
                },
            },
        ],
    },
    {
        path: 'nous-soutenir',
        children: [
            {
                path: 'faire-un-don',
                component: FaireUnDonComponent,
                data: {
                    seo: {
                        title: 'Faire un don',
                        description:
                            'Les dons composent la moitié des revenus de l’association. Ils garantissent son indépendance. En faisant un don à l’association, vous soutenez une petite équipe motivée et compétente.',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'rejoindre-association',
                component: RejoindreAssociationComponent,
                data: {
                    seo: {
                        title: "Rejoindre l'association",
                        description:
                            'Plus nous aurons de membres, plus l’élan sera fort et plus nous pourrons continuer d’identifier en toute indépendance les actions les plus pertinentes à entreprendre.',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'offrir-la-revue-durable',
                component: OffrirLaRevueComponent,
                data: {
                    seo: {
                        title: "Offrir ou s'offrir la revue durable",
                        description:
                            'LaRevueDurable est le cœur battant du travail des Artisans de la transition. La source d’où jaillissent toutes leurs initiatives : Le Climat entre nos mains, les Conversations carbone, les Grands-parents pour le climat, la campagne pour désinvestir de l’industrie des énergies fossiles, le numérique éthique.',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'nous-faire-connaitre',
                component: NousFaireConnaitreComponent,
                data: {
                    seo: {
                        title: 'Nous faire connaître',
                        description:
                            'Vous pouvez mettre des flyers de notre association dans votre commerce ? Installer une « caisse qui parle » dans votre restaurant - une caisse à vin décorée et remplie d’anciens numéros de LaRevueDurable et des flyers en lien avec nos activités ?',
                    } satisfies NaturalSeo,
                },
            },
        ],
    },
    {
        path: 'login',
        component: LoginComponent,
        resolve: {viewer: resolveViewer},
    },
    {
        path: 'mon-compte',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule),
    },
    {
        path: 'larevuedurable',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/larevuedurable/articles',
            },
            {
                path: 'projet',
                component: ProjetComponent,
                data: {
                    seo: {
                        title: 'Notre projet',
                        description:
                            'LaRevueDurable n’est pas un « produit » de presse, c’est une création, une quête permanente. Pour savoir si cette revue peut vous instruire et vous aider à avancer, y a-t-il une autre option que de lire et de découvrir ses numéros ?',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'points-de-vente',
                component: PointsDeVenteComponent,
                data: {
                    seo: {
                        title: 'Points de vente',
                        description:
                            'Pour éviter le gaspillage lié à la vente en kioque, LaRevueDurable est vendue uniquement en librairie. Nous avons une quinzaine de points de vente en Suisse et en France. ',
                    } satisfies NaturalSeo,
                },
            },
        ],
    },
    {
        path: 'manger-c-est-politique',
        component: CircuitsCourtsComponent,
        data: {
            seo: {
                title: "Manger c'est politique",
            } satisfies NaturalSeo,
        },
    },
    {
        path: 'larevuedurable',
        loadChildren: () => import('./modules/shop/shop.module').then(m => m.ShopModule),
    },
    {
        path: 'panier',
        loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule),
    },
    {
        path: 'mentions-legales',
        component: LegalMentionsComponent,
    },
    {
        path: 'cgv',
        component: ConditionsGeneralesVenteComponent,
    },
    {
        path: 'error',
        component: ErrorComponent,
    },
    {
        path: '**',
        component: ErrorComponent,
        data: {notFound: true},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FrontOfficeRoutingModule {}
