import {ChangeDetectionStrategy, Component, inject, InjectionToken} from '@angular/core';
import {MenuItem} from '../../services/navigation.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';

export type MenuDropdownData = {
    items: MenuItem[];
    originalNativeElement: HTMLElement;
    contentHeight: number;
};

export const APP_MENU_DATA = new InjectionToken<MenuDropdownData>('MenuDropdownData');

@Component({
    selector: 'app-menu',
    imports: [CommonModule, RouterLinkActive, RouterLink],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
})
export class MenuComponent {
    public readonly data = inject(APP_MENU_DATA);

    /**
     * Align with main menu button
     */
    public offsetLeft = 0;

    public constructor() {
        const data = this.data;

        this.offsetLeft = data.originalNativeElement.offsetLeft - 20;
    }

    /**
     * Toggle open parent nodes, and allow navigation only on children
     */
    public clickAction(item: MenuItem, event: Event): void {
        this.data.items.forEach(i => (i.open = false));

        if (item.children?.length) {
            // Open / close
            item.open = !item.open;

            // Prevent router link
            event.stopPropagation();
            event.preventDefault();
        }
    }
}
