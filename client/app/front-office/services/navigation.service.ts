import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable, Injector } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { cloneDeep } from 'lodash';
import { merge, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { APP_MENU_DATA, MenuComponent } from '../components/menu/menu.component';

export interface MenuItem {
    display: string;
    children?: MenuItem[];
    link?: RouterLink['routerLink'];
    highlight?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class NavigationService {

    constructor(private overlay: Overlay, private injector: Injector, private router: Router) {
    }

    /**
     * Open menu
     */
    public open(connectedElement: ElementRef<HTMLElement>, items: MenuItem[], offsetTop: number): Observable<any> {

        // Check how many items to display to adjust menu height and prevent overflow (due to absolute positionning)
        let nbOfItems = items.reduce((max, item) => item.children ? Math.max(item.children.length) : max, 0);
        nbOfItems = Math.max(nbOfItems, items.length);

        // Container data
        const injectionTokens = new WeakMap<any, any>();
        injectionTokens.set(APP_MENU_DATA, {
            items: cloneDeep(items),
            originalNativeElement: connectedElement.nativeElement,
            contentHeight: nbOfItems * 38,
        });
        const containerInjector = new PortalInjector(this.injector, injectionTokens);

        const overlayConfig: OverlayConfig = new OverlayConfig({
            width: 'calc(100vw - 40px)',
            maxHeight: 'calc(100vh - ' + (offsetTop + 20) + 'px)',
            disposeOnNavigation: true,
            positionStrategy: this.overlay.position().global().top(offsetTop + 'px').centerHorizontally(),
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
        });

        // Container
        const overlayRef = this.overlay.create(overlayConfig);
        const containerPortal = new ComponentPortal(MenuComponent, undefined, containerInjector);
        const containerRef: ComponentRef<MenuComponent> = overlayRef.attach(containerPortal);

        // Start animation that shows menu
        containerRef.instance.startAnimation();

        // use subject because backdropClick() subscription don't allow two subscriptions (
        const onBackdropClick = new Subject<void>();
        overlayRef.backdropClick().subscribe(() => onBackdropClick.next());

        // Remove overlay on navigation event or on backdrop click
        const onNavigate = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
        const onClose = merge(onBackdropClick, onNavigate);
        onClose.subscribe(() => overlayRef.dispose());

        return onClose;
    }
}
