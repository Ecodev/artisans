import {
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalErrorMessagePipe,
    NaturalFixedButtonDetailComponent,
    NaturalLinkableTabDirective,
    NaturalSelectComponent,
    NaturalSeoResolveData,
    NaturalStampComponent,
} from '@ecodev/natural';
import {Component, inject, OnInit} from '@angular/core';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {EventService} from '../../events/services/event.service';
import {NewsService} from '../../newses/services/news.service';
import {CommentService} from '../services/comment.service';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDivider} from '@angular/material/divider';

@Component({
    selector: 'app-comment',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatTab,
        MatTabGroup,
        NaturalLinkableTabDirective,
        MatDivider,
        MatFormField,
        MatLabel,
        MatError,
        NaturalErrorMessagePipe,
        MatInput,
        NaturalSelectComponent,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss',
})
export class CommentComponent extends NaturalAbstractDetail<CommentService, NaturalSeoResolveData> implements OnInit {
    protected readonly newsService = inject(NewsService);
    protected readonly eventService = inject(EventService);
    protected readonly permissionsService = inject(PermissionsService);

    public constructor() {
        super('comment', inject(CommentService));
    }
}
