import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
    NaturalAbstractList,
    NaturalFixedButtonComponent,
    NaturalIconDirective,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
    TypedMatCellDef,
} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {FacilitatorDocumentsService} from '../services/facilitator-documents.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
} from '@angular/material/table';
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-facilitator-documents',
    imports: [
        NaturalSearchComponent,
        MatTable,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatColumnDef,
        TypedMatCellDef,
        MatRowDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatSort,
        MatSortHeader,
        NaturalTableButtonComponent,
        MatTooltip,
        MatIcon,
        NaturalIconDirective,
        MatProgressSpinner,
        MatPaginator,
        NaturalFixedButtonComponent,
        RouterLink,
        AsyncPipe,
    ],
    templateUrl: './facilitator-documents.component.html',
    styleUrl: './facilitator-documents.component.scss',
})
export class FacilitatorDocumentsComponent extends NaturalAbstractList<FacilitatorDocumentsService> implements OnInit {
    protected readonly permissionsService = inject(PermissionsService);

    public override columnsForTable = ['name', 'category', 'file'];

    public constructor() {
        super(inject(FacilitatorDocumentsService));
    }
}
