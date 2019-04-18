import { Component, OnInit } from '@angular/core';
import { AbstractList } from '../../../natural/classes/AbstractList';
import { Users, UserStatus, UsersVariables } from '../../../shared/generated-types';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '../../../natural/components/alert/alert.service';
import { NaturalPersistenceService } from '../../../natural/services/persistence.service';
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
            naturalSearchConfigurationService,
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
