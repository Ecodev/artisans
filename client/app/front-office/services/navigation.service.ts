import {createGlobalPositionStrategy, createOverlayRef, OverlayConfig} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {DOCUMENT, ElementRef, inject, Injectable, Injector, StaticProvider} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {cloneDeep} from 'es-toolkit';
import {merge, Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {APP_MENU_DATA, MenuComponent, MenuDropdownData} from '../components/menu/menu.component';

export type MenuItem = {
    display: string;
    children?: MenuItem[];
    link?: RouterLink['routerLink'];
    highlight?: boolean;
    open?: boolean;
};

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private readonly injector = inject(Injector);
    private readonly router = inject(Router);
    private readonly document = inject(DOCUMENT);

    /**
     * Open menu
     */
    public open(connectedElement: ElementRef<HTMLElement>, items: MenuItem[], offsetTop: number): Observable<any> {
        // Check how many items to display to adjust menu height and prevent overflow (due to absolute positionning)
        let nbOfItems = items.reduce((max, item) => (item.children ? Math.max(item.children.length) : max), 0);
        nbOfItems = Math.max(nbOfItems, items.length);

        // Container data
        const providers: StaticProvider[] = [
            {
                provide: APP_MENU_DATA,
                useValue: {
                    items: cloneDeep(items),
                    originalNativeElement: connectedElement.nativeElement,
                    contentHeight: nbOfItems * 38,
                } satisfies MenuDropdownData,
            },
        ];

        const containerInjector = Injector.create({providers: providers, parent: this.injector});

        const overlayConfig: OverlayConfig = new OverlayConfig({
            width: 'calc(100vw - 40px)',
            maxHeight: 'calc(100vh - ' + (offsetTop + 20) + 'px)',
            disposeOnNavigation: true,
            positionStrategy: createGlobalPositionStrategy(this.injector)
                .top(offsetTop + 'px')
                .centerHorizontally(),
            hasBackdrop: true,
        });

        // Container
        const overlayRef = createOverlayRef(this.injector, overlayConfig);
        const containerPortal = new ComponentPortal(MenuComponent, undefined, containerInjector);
        overlayRef.attach(containerPortal);

        // use subject because backdropClick() subscription don't allow two subscriptions (
        const onBackdropClick = new Subject<void>();
        overlayRef.backdropClick().subscribe(() => onBackdropClick.next());

        // Remove overlay on navigation event or on backdrop click
        const onNavigate = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
        const onClose = merge(onBackdropClick, onNavigate);
        onClose.subscribe(() => overlayRef.dispose());

        return onClose;
    }

    public scrollToTop(fragment?: string): void {
        const contentContainer = this.document.querySelector('.mat-sidenav-content');
        if (contentContainer) {
            const top = fragment ? this.document.getElementById(fragment)?.offsetTop || 0 : 0;
            contentContainer.scroll({top: top, behavior: top ? 'smooth' : undefined});
        }
    }
}
