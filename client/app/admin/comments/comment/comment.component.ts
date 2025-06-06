import {Component, inject, OnInit} from '@angular/core';
import {
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalFixedButtonDetailComponent,
    NaturalLinkableTabDirective,
    NaturalSelectComponent,
    NaturalSeoResolveData,
    NaturalStampComponent,
} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {EventService} from '../../events/services/event.service';
import {NewsService} from '../../newses/services/news.service';
import {CommentService} from '../services/comment.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatTabsModule,
        NaturalLinkableTabDirective,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        NaturalSelectComponent,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
})
export class CommentComponent extends NaturalAbstractDetail<CommentService, NaturalSeoResolveData> implements OnInit {
    public readonly newsService = inject(NewsService);
    public readonly eventService = inject(EventService);
    public readonly permissionsService = inject(PermissionsService);

    public constructor() {
        super('comment', inject(CommentService));
    }
}
