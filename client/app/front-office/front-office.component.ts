import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NaturalAbstractController, NaturalAlertService } from '@ecodev/natural';
import { differenceBy } from 'lodash';
import { CurrentUserForProfile_viewer, UserRole } from '../shared/generated-types';

interface MenuItem {
    display: string;
    children?: MenuItem[];
    link?: RouterLink['routerLink'];
}

@Component({
    selector: 'app-front-office',
    templateUrl: './front-office.component.html',
    styleUrls: ['./front-office.component.scss'],
})
export class FrontOfficeComponent extends NaturalAbstractController implements OnInit {

    public searchTerm = '';
    public menuOpened = false;

    public UserRole = UserRole;
    public viewer: CurrentUserForProfile_viewer;

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
            link: '/la-revue',
        },
        {
            display: 'Agir avec nous',
            link: 'agir-avec-nous',
            children: [
                {display: 'Les conversations carbonne'},
                {display: 'Les conversations carbonne'},
                {
                    display: 'Les conversations carbonne',
                    children: [
                        {display: 'Les conversations carbonne'},
                        {display: 'Les conversations carbonne'},
                        {display: 'Les conversations carbonne'},
                    ],
                },
                {display: 'Les conversations carbonne'},
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
            link: '/evenements',
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
            link: '/profile',
        },
    ];

    public mobileNavigation: MenuItem[] = [];

    constructor(public route: ActivatedRoute,
                public alertService: NaturalAlertService,
    ) {
        super();
    }

    ngOnInit() {
        this.viewer = this.route.snapshot.data.viewer.model as CurrentUserForProfile_viewer;

        // Setup mobile menu with items from top menu that are missing on main menu
        this.mobileNavigation = [...this.navigation, ...differenceBy(this.topNavigation, this.navigation, 'link')];

        if (this.viewer && this.viewer.role === UserRole.administrator) {
            this.topNavigation.splice(0, 0, {display: 'Administration', link: '/admin'});
            this.mobileNavigation.push({display: 'Administration', link: '/admin'});
        }
    }

    public search() {

    }

}
