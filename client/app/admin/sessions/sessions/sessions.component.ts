import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAbstractList} from '@ecodev/natural';
import {Sessions, SessionsVariables} from '../../../shared/generated-types';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {SessionService} from '../services/session.service';

@Component({
    selector: 'app-sessions',
    templateUrl: './sessions.component.html',
    styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent extends NaturalAbstractList<Sessions['sessions'], SessionsVariables> implements OnInit {
    constructor(
        route: ActivatedRoute,
        sessionService: SessionService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(sessionService, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('sessions');
    }
}
