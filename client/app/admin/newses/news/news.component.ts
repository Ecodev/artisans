import {Component, OnInit, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalFixedButtonDetailComponent,
    NaturalIconDirective,
    NaturalLinkableTabDirective,
    NaturalSeoResolveData,
    NaturalStampComponent,
} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {NewsService} from '../services/news.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NaturalEditorComponent} from '@ecodev/natural-editor';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
        MatTabsModule,
        NaturalLinkableTabDirective,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        NaturalEditorComponent,
        MatSlideToggleModule,
        MatDatepickerModule,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
})
export class NewsComponent extends NaturalAbstractDetail<NewsService, NaturalSeoResolveData> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);

    public constructor() {
        const newsService = inject(NewsService);

        super('news', newsService);
    }
}
