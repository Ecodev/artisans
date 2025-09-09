import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
    NaturalAbstractList,
    NaturalFixedButtonComponent,
    NaturalIconDirective,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {FacilitatorDocumentsService} from '../services/facilitator-documents.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-facilitator-documents',
    imports: [
        NaturalSearchComponent,
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
        AsyncPipe,
    ],
    templateUrl: './facilitator-documents.component.html',
    styleUrl: './facilitator-documents.component.scss',
})
export class FacilitatorDocumentsComponent extends NaturalAbstractList<FacilitatorDocumentsService> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);

    public override columnsForTable = ['name', 'category', 'file'];

    public constructor() {
        super(inject(FacilitatorDocumentsService));
    }
}
