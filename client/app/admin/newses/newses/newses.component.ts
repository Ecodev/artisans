import {Component, OnInit} from '@angular/core';
import {AvailableColumn, NaturalAbstractList} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {NewsService} from '../services/news.service';

@Component({
    selector: 'app-newses',
    templateUrl: './newses.component.html',
    styleUrls: ['./newses.component.scss'],
})
export class NewsesComponent extends NaturalAbstractList<NewsService> implements OnInit {
    public override availableColumns: AvailableColumn[] = [
        {id: 'date', label: 'Date'},
        {id: 'name', label: 'Nom'},
        {id: 'isActive', label: 'Active'},
    ];

    public constructor(service: NewsService, public readonly permissionsService: PermissionsService) {
        super(service);
    }
}
