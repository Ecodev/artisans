import {Component, inject, OnInit} from '@angular/core';
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
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {NaturalEditorComponent} from '@ecodev/natural-editor';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDivider} from '@angular/material/divider';

@Component({
    selector: 'app-news',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatButton,
        RouterLink,
        MatIcon,
        NaturalIconDirective,
        MatTab,
        MatTabGroup,
        NaturalLinkableTabDirective,
        MatDivider,
        MatFormField,
        MatLabel,
        MatError,
        MatSuffix,
        MatInput,
        CdkTextareaAutosize,
        NaturalEditorComponent,
        MatSlideToggle,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss',
})
export class NewsComponent extends NaturalAbstractDetail<NewsService, NaturalSeoResolveData> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);

    public constructor() {
        super('news', inject(NewsService));
    }
}
