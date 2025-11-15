import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {
    NaturalIconDirective,
    NaturalSidenavComponent,
    NaturalSidenavContainerComponent,
    NaturalSidenavContentComponent,
} from '@ecodev/natural';
import {CurrentUserForProfile} from '../../shared/generated-types';
import {MatListItem, MatNavList} from '@angular/material/list';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
    selector: 'app-admin',
    imports: [
        MatToolbar,
        MatIconButton,
        MatIcon,
        NaturalIconDirective,
        RouterLink,
        NaturalSidenavContainerComponent,
        NaturalSidenavComponent,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatNavList,
        MatListItem,
        RouterLinkActive,
        NaturalSidenavContentComponent,
        RouterOutlet,
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);

    protected viewer: CurrentUserForProfile['viewer'] = null;

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer ? this.route.snapshot.data.viewer : null;
    }
}
