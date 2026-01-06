import {Apollo, gql} from 'apollo-angular';
import {Component, inject, OnInit} from '@angular/core';
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
import {
    Import,
    ImportVariables,
    UserSortingField,
    UsersQuery,
    UsersQueryVariables,
} from '../../../shared/generated-types';
import {UserService} from '../services/user.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-import',
    imports: [
        MatButton,
        NaturalFileDropDirective,
        MatIcon,
        NaturalIconDirective,
        MatProgressSpinner,
        RouterLink,
        AsyncPipe,
    ],
    templateUrl: './import.component.html',
})
export class ImportComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    protected readonly permissionsService = inject(PermissionsService);
    private readonly apollo = inject(Apollo);
    private readonly alertService = inject(NaturalAlertService);
    private readonly userService = inject(UserService);

    /**
     * Data attribute provided by activated route snapshot
     */
    protected routeData!: NaturalSeoResolveData;

    protected importing = false;
    protected errors: string[] = [];
    protected result: Import['import'] | null = null;
    protected users: UsersQuery['users']['items'][0][] = [];

    protected readonly params = toNavigationParameters([
        [
            {
                field: 'shouldDelete',
                condition: {equal: {value: true}},
            },
        ],
    ]);

    public ngOnInit(): void {
        this.routeData = this.route.snapshot.data as NaturalSeoResolveData;
    }

    protected uploadFile(selection: FileSelection): void {
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

                    const qvm = new NaturalQueryVariablesManager<UsersQueryVariables>();
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

    protected deleteAll(): void {
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
