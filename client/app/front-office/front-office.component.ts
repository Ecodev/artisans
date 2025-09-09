import {CommonModule} from '@angular/common';
import {AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit} from '@angular/core';
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {
    deliverableEmail,
    ifValid,
    NaturalAlertService,
    NaturalIconDirective,
    NaturalSearchSelections,
    toNavigationParameters,
} from '@ecodev/natural';
import {differenceBy} from 'es-toolkit';
import {filter, finalize} from 'rxjs/operators';
import {UserService} from '../admin/users/services/user.service';
import {CurrentUserForProfile, UserRole} from '../shared/generated-types';
import {Currency, CurrencyService} from '../shared/services/currency.service';
import {MenuItem, NavigationService} from './services/navigation.service';
import {MatListModule} from '@angular/material/list';
import {BreadcrumbsComponent} from '../shared/components/breadcrumbs/breadcrumbs.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatRippleModule} from '@angular/material/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-front-office',
    imports: [
        CommonModule,
        MatRippleModule,
        RouterLink,
        RouterLinkActive,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        NaturalIconDirective,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        BreadcrumbsComponent,
        RouterOutlet,
        ReactiveFormsModule,
        MatListModule,
    ],
    templateUrl: './front-office.component.html',
    styleUrl: './front-office.component.scss',
})
export class FrontOfficeComponent implements OnInit, AfterViewInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly navigationService = inject(NavigationService);
    public readonly userService = inject(UserService);
    public readonly currencyService = inject(CurrencyService);
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly alertService = inject(NaturalAlertService);

    private readonly destroyRef = inject(DestroyRef);
    public searchTerm = '';
    public menuOpened = false;

    public viewer: CurrentUserForProfile['viewer'] = null;
    public readonly newsletterForm = this.fb.group({
        email: ['', [Validators.required, deliverableEmail, Validators.maxLength(191)]],
    });

    /**
     * In case of change, check CSS dimensions :
     * li.opened > ul {max-height: 400px} // mobile menu for transition
     * .hasMenu { height: 300px} // white background on mega menu
     */
    public navigation: MenuItem[] = [
        {
            display: "L'association",
            link: '/association',
            children: [
                {
                    display: 'Nos convictions',
                    link: '/association/nos-convictions',
                },
                {
                    display: 'Qui sommes-nous ?',
                    link: '/association/qui-sommes-nous',
                },
                {
                    display: 'Comité et statuts',
                    link: '/association/statuts',
                },
                {
                    display: 'Partenariats et coopérations',
                    link: '/association/partenariats',
                },
                {
                    display: 'Actualités',
                    link: 'actualite',
                },
                {
                    display: 'Contact',
                    link: 'contact',
                },
            ],
        },
        {
            display: 'La revue durable',
            link: '/larevuedurable',
            children: [
                {
                    display: 'Notre projet',
                    link: '/larevuedurable/projet',
                },
                {
                    display: 'Tous les articles',
                    link: '/larevuedurable/articles',
                },
                {
                    display: 'Tous les numéros',
                    link: '/larevuedurable/numeros',
                },
                {
                    display: 'Nos points de vente',
                    link: '/larevuedurable/points-de-vente',
                },
                {
                    display: "S'abonner",
                    link: '/larevuedurable/abonnements',
                },
            ],
        },
        {
            display: 'Agir avec nous',
            link: '/agir-avec-nous',
            children: [
                {
                    display: 'Toutes nos actions',
                    link: '/agir-avec-nous/toutes-nos-actions',
                },
                {
                    display: 'Alimentation',
                    link: '/agir-avec-nous/alimentation',
                },
                {
                    display: 'Participer à une Conversation carbone',
                    link: '/agir-avec-nous/conversation-carbone',
                    children: [
                        {
                            display: 'La méthode',
                            link: '/agir-avec-nous/conversation-carbone/methode',
                        },
                        {
                            display: 'Prochaines sessions',
                            link: '/agir-avec-nous/conversation-carbone/prochaines',
                        },
                        {
                            display: 'Pour les organisations',
                            link: '/agir-avec-nous/conversation-carbone/organisations',
                        },
                        {
                            display: 'Les facilitateurs',
                            link: '/agir-avec-nous/conversation-carbone/facilitateurs',
                        },
                    ],
                },
                {
                    display: "Desinvestir de l'industrie des énergies fossiles",
                    link: '/agir-avec-nous/desinvestir',
                    children: [
                        {
                            display: 'La campagne',
                            link: '/agir-avec-nous/desinvestir/industrie-energies-fossiles',
                        },
                        {
                            display: 'Rapports sur la BNS',
                            link: 'agir-avec-nous/desinvestir/rapport-bns',
                        },
                        // Disable
                        // {
                        //     display: 'Atelier finance',
                        //     link: '/agir-avec-nous/desinvestir/atelier-finance',
                        // },
                    ],
                },
                {
                    display: 'Numérique éthique',
                    link: '/agir-avec-nous/numerique-ethique',
                },
                {
                    display: 'Agir au quotidien',
                    link: '/agir-avec-nous/agir-au-quotidien',
                },
            ],
        },
        {
            display: 'Nous soutenir',
            link: '/nous-soutenir',
            children: [
                {
                    display: 'Faire un don',
                    link: '/nous-soutenir/faire-un-don',
                },
                {
                    display: "Rejoindre l'association",
                    link: '/nous-soutenir/rejoindre-association',
                },
                {
                    display: "Offrir ou s'offrir LaRevueDurable ",
                    link: '/nous-soutenir/offrir-la-revue-durable',
                },
                {
                    display: 'Nous faire connaître',
                    link: '/nous-soutenir/nous-faire-connaitre',
                },
            ],
        },
    ];

    public topNavigation: MenuItem[] = [
        {
            display: 'Agenda',
            link: '/agenda',
        },
        {
            display: 'Actualités',
            link: '/actualite',
        },
        {
            display: 'Nous contacter',
            link: '/contact',
        },
        {
            display: 'Mon compte',
            link: '/mon-compte',
            children: [
                {
                    display: 'Articles et revues achetées',
                    link: '/mon-compte/articles-achetes',
                },
                {
                    display: 'Données personnelles',
                    link: '/mon-compte/donnees-personnelles',
                },
                {
                    display: 'Commandes',
                    link: '/mon-compte/commandes',
                },
            ],
        },
        {
            display: 'Panier',
            link: '/panier',
        },
    ];

    public mobileNavigation: MenuItem[] = [];

    public Currency = Currency;
    public UserRole = UserRole;

    public ngOnInit(): void {
        this.userService.getViewerObservable().subscribe(viewer => (this.viewer = viewer));

        // Setup mobile menu with items from top menu that are missing on main menu
        this.mobileNavigation = [...this.navigation, ...differenceBy(this.topNavigation, this.navigation, n => n.link)];

        // Further navigations
        this.router.events
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe(() => {
                this.goToFragment();
            });
    }

    public ngAfterViewInit(): void {
        // First load
        if (this.route.snapshot.fragment) {
            setTimeout(() => this.goToFragment(), 1000);
        }
    }

    private goToFragment(): void {
        this.navigationService.scrollToTop(this.route.snapshot.fragment!);
    }

    /**
     * To reuse some implemented mechanics, the search is just a redirection that converts the search string into a
     * global natural search
     */
    public search(): void {
        const search: NaturalSearchSelections = [
            [
                {
                    field: 'search',
                    condition: {like: {value: this.searchTerm}},
                },
            ],
        ];

        this.router.navigate(['/larevuedurable/recherche', toNavigationParameters(search)]);
    }

    public openMenuDropdown(items: MenuItem[], event: MouseEvent): void {
        if (!items?.length) {
            return;
        }

        // Prevent router link
        event.stopPropagation();
        event.preventDefault();

        const openClass = 'open';

        let target = (event.target || event.currentTarget) as HTMLElement;
        target = target.parentNode as HTMLElement;

        target.classList.add(openClass);
        const position = target.getBoundingClientRect().top + target.offsetHeight; // bottom position of target relative to viewport

        this.navigationService
            .open(new ElementRef(target), items, position)
            .subscribe(() => target.classList.remove(openClass));
    }

    public subscribeNewsletter(): void {
        ifValid(this.newsletterForm).subscribe(() => {
            this.newsletterForm.disable();
            this.userService
                .subscribeNewsletter(this.newsletterForm.getRawValue().email)
                .pipe(finalize(() => this.newsletterForm.enable()))
                .subscribe(() => {
                    this.newsletterForm.controls.email.setValue('');
                    this.newsletterForm.controls.email.markAsPristine();

                    // Exceptionally show a dialog, instead of snackbar, because
                    // we want to be triple sure that the user saw it worked and
                    // avoid him to re-submit the same email again
                    this.alertService.confirm(
                        'Inscription réussie',
                        'Merci de vous être inscrit à la newsletter',
                        'Fermer',
                    );
                });
        });
    }
}
