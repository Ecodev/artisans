import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '../../../natural/components/alert/alert.service';
import { NaturalPersistenceService } from '../../../natural/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { AbstractList } from '../../../natural/classes/AbstractList';
import { Licenses, LicensesVariables } from '../../../shared/generated-types';
import { LicenseService } from '../services/license.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-licenses',
    templateUrl: './licenses.component.html',
    styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent extends AbstractList<Licenses['licenses'], LicensesVariables> implements OnInit {

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
            naturalSearchConfigurationService,
        );

    }
}
