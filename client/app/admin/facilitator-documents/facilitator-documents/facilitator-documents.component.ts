import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAbstractList} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {FacilitatorDocumentsService} from '../services/facilitator-documents.service';

@Component({
    selector: 'app-facilitator-documents',
    templateUrl: './facilitator-documents.component.html',
    styleUrls: ['./facilitator-documents.component.scss'],
})
export class FacilitatorDocumentsComponent extends NaturalAbstractList<FacilitatorDocumentsService> implements OnInit {
    public columnsForTable = ['name', 'category', 'file'];

    public constructor(
        route: ActivatedRoute,
        facilitatorDocumentService: FacilitatorDocumentsService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(facilitatorDocumentService, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('facilitatorDocumentsAdmin');
    }
}
