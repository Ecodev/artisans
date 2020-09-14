import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {Literal} from '@ecodev/natural';
import {filter} from 'rxjs/operators';
import * as striptags from 'striptags';

export interface SEO {
    title?: string;
    description?: string;
    robots?: string;
}

@Injectable({
    providedIn: 'root',
})
export class SeoService {
    /**
     * List of items that are resolved for display in detail page. Used to dynamically display title + description tags
     */
    private resolvedItems = ['product', 'news', 'event'];

    /**
     * Added to title, with dash separation if there is a resolved item name
     */
    public defaultTitle = 'Les artisans de la transition';

    constructor(private router: Router, private titleService: Title, private metaTagService: Meta) {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
            const data = this.getData();
            const seo = data.seo ?? {};

            const resolved = this.resolvedItems.reduce((result, name) => {
                if (result) return result;
                return data[name]
                    ? {name: data[name].model.name, description: striptags(data[name].model.description)}
                    : null;
            }, null);

            this.updateSeo(seo, resolved);
        });
    }

    public updateSeo(seo: SEO, resolved: {name?: string; description?: string} | null) {
        // Title
        const dynamicName = resolved?.name || seo?.title;
        this.titleService.setTitle(dynamicName ? dynamicName + ' - ' + this.defaultTitle : this.defaultTitle);

        // Description
        this.metaTagService.updateTag({
            name: 'description',
            value:
                resolved?.description ||
                seo?.description ||
                'Comprendre l’urgence écologique, Des pistes pour y répondre',
        });

        // Robots
        this.metaTagService.updateTag({name: 'robots', value: seo?.robots ?? 'index,follow'});
    }

    /**
     * Returns the data from the most deep/specific activated route
     */
    public getData(route?: ActivatedRoute | ActivatedRouteSnapshot): Literal {
        if (!route) {
            route = this.router.routerState.root;
        }

        if (route?.firstChild) {
            return this.getData(route?.firstChild);
        } else {
            return route['snapshot']['data'] ?? null;
        }
    }
}
