import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalAvatarComponent,
    NaturalColumnsPickerComponent,
    NaturalFixedButtonComponent,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {sessions} from '../../../shared/natural-search/natural-search-facets';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {SessionService} from '../services/session.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-sessions',
    templateUrl: './sessions.component.html',
    styleUrl: './sessions.component.scss',
    imports: [
        CommonModule,
        NaturalColumnsPickerComponent,
        NaturalSearchComponent,
        MatTableModule,
        MatSortModule,
        NaturalTableButtonComponent,
        MatTooltipModule,
        NaturalAvatarComponent,
        MatButtonModule,
        RouterLink,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalFixedButtonComponent,
    ],
})
export class SessionsComponent extends NaturalAbstractList<SessionService> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);

    public override availableColumns: AvailableColumn[] = [
        {id: 'name', label: 'Nom'},
        {id: 'startDate', label: 'Première date'},
        {id: 'endDate', label: "Date d'appel à contribution"},
        {id: 'facilitators', label: 'Facilitateurs'},
        {id: 'street', label: 'Rue'},
        {id: 'locality', label: 'Ville'},
        {id: 'region', label: 'Canton'},
    ];

    public constructor() {
        super(inject(SessionService));

        this.naturalSearchFacets = sessions();
    }
}
