import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
    NaturalAbstractList,
    NaturalFixedButtonComponent,
    NaturalIconDirective,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
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

@Component({
    selector: 'app-facilitator-documents',
    templateUrl: './facilitator-documents.component.html',
    styleUrl: './facilitator-documents.component.scss',
    standalone: true,
    imports: [
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
        facilitatorDocumentService: FacilitatorDocumentsService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(facilitatorDocumentService);

        this.naturalSearchFacets = naturalSearchFacetsService.get('facilitatorDocumentsAdmin');
    }
}
