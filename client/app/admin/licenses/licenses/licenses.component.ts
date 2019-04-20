import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { NaturalPersistenceService } from '@ecodev/natural';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { NaturalAbstractList } from '@ecodev/natural';
import { Licenses, LicensesVariables } from '../../../shared/generated-types';
import { LicenseService } from '../services/license.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-licenses',
    templateUrl: './licenses.component.html',
    styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent extends NaturalAbstractList<Licenses['licenses'], LicensesVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                licenseService: LicenseService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('licenses',
            licenseService,
            router,
            route,
            alertService,
            persistenceService,

        );

    }
}
