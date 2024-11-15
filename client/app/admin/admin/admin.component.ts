import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {
    NaturalIconDirective,
    NaturalSidenavComponent,
    NaturalSidenavContainerComponent,
    NaturalSidenavContentComponent,
} from '@ecodev/natural';
import {CurrentUserForProfile} from '../../shared/generated-types';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        NaturalIconDirective,
        RouterLink,
        NaturalSidenavContainerComponent,
        NaturalSidenavComponent,
        MatExpansionModule,
        MatListModule,
        RouterLinkActive,
        NaturalSidenavContentComponent,
        RouterOutlet,
    ],
})
export class AdminComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);

    public viewer: CurrentUserForProfile['viewer'] = null;

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer ? this.route.snapshot.data.viewer : null;
    }
}
