import { Component, HostBinding, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { merge } from 'lodash';

interface IconType {
    name: string;
    svg?: string;
    font?: string;
    class?: 'negative' | 'neutral' | 'positive';
}

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
})
export class IconComponent {

    private static registered = false;

    @HostBinding('class.material-icons') isMaterialIcon = true;
    @HostBinding('class.mat-icon') isIcon = true;

    @Input() label;
    @Input() labelColor: 'primary' | 'warn' | 'accent' = 'accent';
    @Input() labelPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';

    @Input() set name(value: string) {
        const newIcon: IconType = {name: value};
        if (this.mapping[value]) {
            this.icon = merge(newIcon, this.mapping[value]);
        } else {
            newIcon.font = value;
            this.icon = newIcon;
        }
    }

    private readonly svgBase = './assets/icons/';

    public icon: IconType;

    /**
     * Mapping table of internal icon aliases
     */
    private readonly mapping: { [key: string]: { font?: string, svg?: string, class?: 'negative' | 'neutral' | 'positive' } } = {
        // 'asdf': {
        //     font: 'trending_down',
        //     class: 'negative',
        // },
        // 'qwer': {
        //     svg : 'asterisk.svg'
        // }
    };

    constructor(public matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.registerIcons();
    }

    private registerIcons() {

        if (IconComponent.registered) {
            return;
        }

        for (const key in this.mapping) {
            if (this.mapping[key].svg) {
                this.matIconRegistry.addSvgIcon(key,
                    this.domSanitizer.bypassSecurityTrustResourceUrl(this.svgBase + this.mapping[key].svg));
            }
        }

        IconComponent.registered = true;

    }

}
