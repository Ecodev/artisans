import {Component, OnInit} from '@angular/core';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalColumnsPickerComponent,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CommentService} from '../services/comment.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.scss',
    standalone: true,
    imports: [
        NaturalColumnsPickerComponent,
        NaturalSearchComponent,
        MatTableModule,
        MatSortModule,
        NaturalTableButtonComponent,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
    ],
})
export class CommentsComponent extends NaturalAbstractList<CommentService> implements OnInit {
    public override availableColumns: AvailableColumn[] = [
        {id: 'description', label: 'Commentaire'},
        {id: 'event', label: 'News'},
        {id: 'news', label: 'Actualité'},
    ];

    public constructor(
        service: CommentService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(service);
    }
}
