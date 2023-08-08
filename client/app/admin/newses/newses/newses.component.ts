import {Component, OnInit} from '@angular/core';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalColumnsPickerComponent,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
    NaturalIconDirective,
    NaturalFixedButtonComponent,
} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {NewsService} from '../services/news.service';
import {RouterLink} from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {NgIf, DatePipe} from '@angular/common';

@Component({
    selector: 'app-newses',
    templateUrl: './newses.component.html',
    styleUrls: ['./newses.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        FlexModule,
        NaturalColumnsPickerComponent,
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
        DatePipe,
    ],
})
export class NewsesComponent extends NaturalAbstractList<NewsService> implements OnInit {
    public override availableColumns: AvailableColumn[] = [
        {id: 'date', label: 'Date'},
        {id: 'name', label: 'Nom'},
        {id: 'isActive', label: 'Active'},
    ];

    public constructor(
        service: NewsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(service);
    }
}
