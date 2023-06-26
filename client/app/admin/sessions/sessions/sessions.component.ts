import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AvailableColumn, NaturalAbstractList} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {SessionService} from '../services/session.service';

@Component({
    selector: 'app-sessions',
    templateUrl: './sessions.component.html',
    styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent extends NaturalAbstractList<SessionService> implements OnInit {
    public override availableColumns: AvailableColumn[] = [
        {id: 'name', label: 'Nom'},
        {id: 'startDate', label: 'Première date'},
        {id: 'endDate', label: "Date d'appel à contribution"},
        {id: 'facilitators', label: 'Facilitateurs'},
        {id: 'street', label: 'Rue'},
        {id: 'locality', label: 'Ville'},
        {id: 'region', label: 'Canton'},
    ];

    public constructor(
        route: ActivatedRoute,
        sessionService: SessionService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(sessionService);

        this.naturalSearchFacets = naturalSearchFacetsService.get('sessions');
    }
}
