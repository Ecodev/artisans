import { Component, OnInit } from '@angular/core';
import { NaturalAbstractList } from '@ecodev/natural';
import { Users, UserStatus, UsersVariables } from '../../../shared/generated-types';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { NaturalPersistenceService } from '@ecodev/natural';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { UserService } from '../services/user.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends NaturalAbstractList<Users['users'], UsersVariables> implements OnInit {

    public initialColumns = [
        'balance',
        'name',
        'login',
        'age',
        'creationDate',
        'updateDate',
        'status',
        'flagWelcomeSessionDate',
    ];

    constructor(route: ActivatedRoute,
                router: Router,
                private userService: UserService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('users',
            userService,
            router,
            route,
            alertService,
            persistenceService,

        );

    }

    public flagWelcomeSessionDate(user) {
        this.userService.flagWelcomeSessionDate(user.id).subscribe((u) => {
            user = u;
        });
    }

    public activate(user) {
        this.userService.activate(user.id).subscribe((u) => {
            user = u;
        });
    }

    public isActive(user) {
        return user.status === UserStatus.active;
    }

    public isNew(user) {
        return user.status === UserStatus.new;
    }

}
