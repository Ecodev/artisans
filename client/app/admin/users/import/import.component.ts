import {Apollo, gql} from 'apollo-angular';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {
    FileSelection,
    NaturalAlertService,
    NaturalFileDropDirective,
    NaturalIconDirective,
    NaturalQueryVariablesManager,
    NaturalSeoResolveData,
    toNavigationParameters,
} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {Import, ImportVariables, Users, UserSortingField, UsersVariables} from '../../../shared/generated-types';
import {UserService} from '../services/user.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-import',
    templateUrl: './import.component.html',
    standalone: true,
    imports: [
        MatButtonModule,
        NaturalFileDropDirective,
        MatIconModule,
        NaturalIconDirective,
        MatProgressSpinnerModule,
        RouterLink,
    ],
})
export class ImportComponent implements OnInit {
    /**
     * Data attribute provided by activated route snapshot
     */
    public routeData!: NaturalSeoResolveData;

    public importing = false;
    public errors: string[] = [];
    public result: Import['import'] | null = null;
    public users: Users['users']['items'][0][] = [];

    public readonly params = toNavigationParameters([
        [
            {
                field: 'shouldDelete',
                condition: {equal: {value: true}},
            },
        ],
    ]);

    public constructor(
        private readonly route: ActivatedRoute,
        public readonly permissionsService: PermissionsService,
        private readonly apollo: Apollo,
        private readonly alertService: NaturalAlertService,
        private readonly userService: UserService,
    ) {}

    public ngOnInit(): void {
        this.routeData = this.route.snapshot.data as NaturalSeoResolveData;
    }

    public uploadFile(selection: FileSelection): void {
        this.errors = [];
        this.result = null;
        this.users = [];

        if (!selection.valid.length) {
            this.errors.push('Le fichier séléctionné ne semble pas être un CSV');
            return;
        }

        const file = selection.valid[0];
        this.importing = true;

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
            .subscribe({
                next: result => {
                    this.importing = false;

                    this.result = result.data!.import;
                    this.alertService.info(this.result.totalLines + ' lignes importées', 5000);

                    const qvm = new NaturalQueryVariablesManager<UsersVariables>();
                    qvm.set('variables', {
                        filter: {groups: [{conditions: [{shouldDelete: {equal: {value: true}}}]}]},
                        pagination: {pageSize: 9999},
                        sorting: [{field: UserSortingField.firstName}, {field: UserSortingField.lastName}],
                    });
                    this.userService.getAll(qvm).subscribe(users => (this.users = users.items));
                },
                error: error => {
                    const message = error.message.replace(/^GraphQL error: /, '');
                    this.errors = message.split('\n');
                    this.importing = false;
                },
            });
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
                    this.userService.delete(this.users).subscribe(() => {
                        this.alertService.info(this.users.length + ' utilisateurs supprimés');
                        this.users = [];
                    });
                }
            });
    }
}
