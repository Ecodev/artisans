import {Component, inject, OnInit} from '@angular/core';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalColumnsPickerComponent,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CommentService} from '../services/comment.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
} from '@angular/material/table';

@Component({
    selector: 'app-comments',
    imports: [
        NaturalColumnsPickerComponent,
        NaturalSearchComponent,
        MatTable,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatColumnDef,
        MatCellDef,
        MatRowDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatSort,
        MatSortHeader,
        NaturalTableButtonComponent,
        MatTooltip,
        MatProgressSpinner,
        MatPaginator,
    ],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.scss',
})
export class CommentsComponent extends NaturalAbstractList<CommentService> implements OnInit {
    protected readonly permissionsService = inject(PermissionsService);

    public override availableColumns: AvailableColumn[] = [
        {id: 'description', label: 'Commentaire'},
        {id: 'event', label: 'News'},
        {id: 'news', label: 'Actualité'},
    ];

    public constructor() {
        super(inject(CommentService));
    }
}
