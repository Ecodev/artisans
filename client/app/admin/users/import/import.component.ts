import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {NaturalAlertService, NaturalQueryVariablesManager, toUrl} from '@ecodev/natural';
import {Apollo} from 'apollo-angular';
import {PermissionsService} from '../../../shared/services/permissions.service';
import gql from 'graphql-tag';
import {Import, ImportVariables, Users_users_items, UsersVariables} from '../../../shared/generated-types';
import {UserService} from '../services/user.service';

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
    public users: Users_users_items[] = [];

    public readonly params = {
        ns: JSON.stringify(
            toUrl([
                [
                    {
                        field: 'shouldDelete',
                        condition: {equal: {value: true}},
                    },
                ],
            ]),
        ),
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public permissionsService: PermissionsService,
        private apollo: Apollo,
        private alertService: NaturalAlertService,
        private userService: UserService,
    ) {}

    public ngOnInit(): void {
        this.routeData = this.route.snapshot.data;
    }

    uploadFile(file: File): void {
        this.importing = true;
        this.error = null;
        this.result = null;
        this.users = [];

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

        this.apollo
            .mutate<Import, ImportVariables>({
                mutation: mutation,
                variables: {
                    file: file,
                },
            })
            .subscribe(
                result => {
                    this.importing = false;

                    this.result = result.data!.import;
                    this.alertService.info(this.result.totalLines + ' lignes importées', 5000);

                    const qvm = new NaturalQueryVariablesManager<UsersVariables>();
                    qvm.set('variables', {filter: {groups: [{conditions: [{shouldDelete: {equal: {value: true}}}]}]}});
                    this.userService.getAll(qvm).subscribe(users => (this.users = users.items));
                },
                error => {
                    error.message = error.message.replace(/^GraphQL error: /, '');
                    this.error = error;
                    this.importing = false;
                },
            );
    }

    public deleteAll(): void {
        this.alertService
            .confirm(
                'Suppression',
                'Voulez-vous supprimer définitivement ' + this.users.length + ' utilisateurs ?',
                'Supprimer définitivement',
            )
            .subscribe(confirmed => {
                if (confirmed) {
                    this.userService.delete(this.users).subscribe(v => {
                        this.alertService.info(this.users.length + ' utilisateurs supprimés');
                        this.users = [];
                    });
                }
            });
    }
}
