import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NaturalAbstractController, NaturalSearchSelections, toUrl } from '@ecodev/natural';
import { differenceBy } from 'lodash';
import { filter } from 'rxjs/operators';
import { UserService } from '../admin/users/services/user.service';
import { CurrentUserForProfile_viewer, UserRole } from '../shared/generated-types';
import { Currency, CurrencyService } from '../shared/services/currency.service';
import { CartService } from './modules/cart/services/cart.service';
import { MenuItem, NavigationService } from './services/navigation.service';

@Component({
    selector: 'app-front-office',
    templateUrl: './front-office.component.html',
    styleUrls: ['./front-office.component.scss'],
    animations: [],
})
export class FrontOfficeComponent extends NaturalAbstractController implements OnInit {

    public searchTerm = '';
    public menuOpened = false;

    public viewer: CurrentUserForProfile_viewer | null;

    /**
     * In case of change, check CSS dimensions :
     * li.opened > ul {max-height: 400px} // mobile menu for transition
     * .hasMenu { height: 300px} // white background on mega menu
     */
    public navigation: MenuItem[] = [
        {
            display: 'L\'association',
            link: '/association',
        },
        {
            display: 'La revue durable',
            link: '/larevuedurable',
            children: [
                {
                    display: 'Notre projet',
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
                    // link: '/' ???
                },
                {
                    display: 'S\'abonner',
                    link: '/larevuedurable/abonnements',
                    highlight: true,
                },
            ],
        },
        {
            display: 'Agir avec nous',
            link: '/agir-avec-nous',
            children: [
                {display: 'Toutes nos actions'},
                {display: 'Calculer son bilan carbone'},
                {
                    display: 'Conversations carbone',
                    children: [
                        {display: 'La méthode'},
                        {
                            display: 'Prochaines sessions',
                            link: '/agir-avec-nous/prochaines-conversations-carbone',
                        },
                        {display: 'Pour les organisations'},
                        {display: 'Facilitateurs'},
                        {display: 'Les partenaires'},
                    ],
                },
                {display: 'Les conversations carbone'},
            ],
        },
        {
            display: 'Nous soutenir',
            link: '/nous-soutenir',
        },
    ];

    public topNavigation: MenuItem[] = [
        {
            display: 'Agenda',
            link: '/agenda',
        },
        {
            display: 'Actualité',
            link: '/actualite',
        },
        {
            display: 'Nous contacter',
            link: '/contact',
        },
        {
            display: 'Panier',
            link: '/panier',
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
    ];

    public mobileNavigation: MenuItem[] = [];

    public Currency = Currency;
    public UserRole = UserRole;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private navigationService: NavigationService,
        public userService: UserService,
        public currencyService: CurrencyService,
        cartService: CartService,
        @Inject(DOCUMENT) private readonly document: Document,
    ) {
        super();

        // We can have multiple parallel carts
        // We have to call first a cart that will stay at index zero of list of carts. BOComponent is earliest place for that.
        cartService.initGlobalCart();
    }

    public ngOnInit(): void {

        this.userService.getViewerObservable().subscribe(viewer => this.viewer = viewer);

        // Setup mobile menu with items from top menu that are missing on main menu
        this.mobileNavigation = [...this.navigation, ...differenceBy(this.topNavigation, this.navigation, 'link')];

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                const contentContainer = this.document.querySelector('.mat-sidenav-content');
                if (contentContainer) {
                    const top = document.getElementById(this.route.snapshot.fragment)?.offsetTop || 0;
                    contentContainer.scroll({top: top, behavior: top ? 'smooth' : undefined});
                }
            });
    }

    /**
     * To reuse some implemented mechanics, the search is just a redirection that converts the search string into a global natural search
     */
    public search() {

        const search: NaturalSearchSelections = [
            [
                {
                    field: 'search',
                    condition: {like: {value: this.searchTerm}},
                },
            ],
        ];

        this.router.navigate(['/larevuedurable/recherche', {ns: JSON.stringify(toUrl(search))}]);
    }

    public openMenuDropdown(items: MenuItem[], event: MouseEvent) {

        if (!items || !items.length) {
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

        this.navigationService.open(new ElementRef(target), items, position).subscribe(() => target.classList.remove(openClass));
    }

}
