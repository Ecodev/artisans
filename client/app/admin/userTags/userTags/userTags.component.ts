import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { PersistenceService } from '../../shared/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { AbstractList } from '../../shared/components/AbstractList';
import { UserTagsQuery, UserTagsQueryVariables } from '../../../shared/generated-types';
import { UserTagService } from '../services/userTag.service';

@Component({
    selector: 'app-user-tags',
    templateUrl: './userTags.component.html',
    styleUrls: ['./userTags.component.scss'],
})
export class UserTagsComponent extends AbstractList<UserTagsQuery['userTags'], UserTagsQueryVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                userTagService: UserTagService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService) {

        super('userTags',
            userTagService,
            router,
            route,
            alertService,
            persistenceService,
            naturalSearchConfigurationService,
        );

    }
}
