import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { NaturalAlertService } from '@ecodev/natural';
import {
    CreateLicense,
    CreateLicenseVariables,
    DeleteLicenses,
    License,
    LicenseVariables,
    UpdateLicense,
    UpdateLicenseVariables,
} from '../../../shared/generated-types';
import { LicenseService } from '../services/license.service';
import { BookableService } from '../../bookables/services/bookable.service';
import { UserService } from '../../users/services/user.service';

@Component({
    selector: 'app-license',
    templateUrl: './license.component.html',
    styleUrls: ['./license.component.scss'],
})
export class LicenseComponent
    extends NaturalAbstractDetail<License['license'],
        LicenseVariables,
        CreateLicense['createLicense'],
        CreateLicenseVariables,
        UpdateLicense['updateLicense'],
        UpdateLicenseVariables,
        DeleteLicenses> {

    constructor(alertService: NaturalAlertService,
                licenseService: LicenseService,
                router: Router,
                route: ActivatedRoute,
                public userService: UserService,
                public bookableService: BookableService,
    ) {
        super('license', licenseService, alertService, router, route);
    }
}
