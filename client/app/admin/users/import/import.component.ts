import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { PermissionsService } from '../../../shared/services/permissions.service';
import gql from 'graphql-tag';
import { Import, ImportVariables } from '../../../shared/generated-types';

@Component({
    selector: 'app-import',
    templateUrl: './import.component.html',
})
export class ImportComponent implements OnInit {
    /**
     * Data attribute provided by activated route snapshot
     */
    public routeData: Data;

    public importing = false;
    public error: Error | null = null;
    public result: Import['import'] | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public permissionsService: PermissionsService,
        private apollo: Apollo,
        private alertService: NaturalAlertService,
    ) {
    }

    public ngOnInit(): void {
        this.routeData = this.route.snapshot.data;
    }

    uploadFile(file: File): void {
        this.importing = true;
        this.error = null;
        this.result = null;

        const mutation = gql`
            mutation Import($file: Upload!) {
                import(file: $file) {
                    updatedUsers
                    updatedOrganizations
                    deletedOrganizations
                    totalUsers
                    totalOrganizations
                    totalLines
                    time
                }
            }
        `;

        this.apollo.mutate<Import, ImportVariables>({
            mutation: mutation,
            variables: {
                file: file,
            },
        }).subscribe(result => {
                this.importing = false;

                this.result = (result.data as Import).import;
                this.alertService.info(this.result.totalLines + ' lignes importées', 5000);
            },
            error => {
                error.message = error.message.replace(/^GraphQL error: /, '')
                this.error = error;
                this.importing = false;
            },
        );
    }
}
