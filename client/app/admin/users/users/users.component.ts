import { Component, OnInit } from '@angular/core';
import { AbstractList } from '../../shared/components/AbstractList';
import { Users, UsersVariables } from '../../../shared/generated-types';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { PersistenceService } from '../../shared/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { UserService } from '../services/user.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends AbstractList<Users['users'], UsersVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                userService: UserService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('users',
            userService,
            router,
            route,
            alertService,
            persistenceService,
            naturalSearchConfigurationService,
        );

    }

}
