import {Component, OnInit} from '@angular/core';
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
    public override columnsForTable = ['name', 'category', 'file'];

    public constructor(
        route: ActivatedRoute,
        facilitatorDocumentService: FacilitatorDocumentsService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(facilitatorDocumentService);

        this.naturalSearchFacets = naturalSearchFacetsService.get('facilitatorDocumentsAdmin');
    }
}
