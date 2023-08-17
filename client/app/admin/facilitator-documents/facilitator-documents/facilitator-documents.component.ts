import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {
    NaturalAbstractList,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
    NaturalIconDirective,
    NaturalFixedButtonComponent,
} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {FacilitatorDocumentsService} from '../services/facilitator-documents.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-facilitator-documents',
    templateUrl: './facilitator-documents.component.html',
    styleUrls: ['./facilitator-documents.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FlexModule,
        NaturalSearchComponent,
        ExtendedModule,
        MatTableModule,
        MatSortModule,
        NaturalTableButtonComponent,
        MatTooltipModule,
        MatIconModule,
        NaturalIconDirective,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalFixedButtonComponent,
        RouterLink,
    ],
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
