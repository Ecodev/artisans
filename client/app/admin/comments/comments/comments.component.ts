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
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
    standalone: true,
    imports: [
        FlexModule,
        NaturalColumnsPickerComponent,
        NaturalSearchComponent,
        ExtendedModule,
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
