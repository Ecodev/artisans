import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../natural/components/alert/alert.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { UserTags, UserTagsVariables } from '../../../shared/generated-types';
import { UserTagService } from '../services/userTag.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { PersistenceService } from '../../../natural/services/persistence.service';
import { AbstractList } from '../../../natural/classes/AbstractList';

@Component({
    selector: 'app-user-tags',
    templateUrl: './userTags.component.html',
    styleUrls: ['./userTags.component.scss'],
})
export class UserTagsComponent extends AbstractList<UserTags['userTags'], UserTagsVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                userTagService: UserTagService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

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
