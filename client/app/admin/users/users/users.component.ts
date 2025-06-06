import {Apollo} from 'apollo-angular';
import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
    AvailableColumn,
    Button,
    copyToClipboard,
    NaturalAbstractList,
    NaturalAvatarComponent,
    NaturalColumnsPickerComponent,
    NaturalEnumPipe,
    NaturalFixedButtonComponent,
    NaturalQueryVariablesManager,
    NaturalSearchComponent,
    NaturalSearchSelections,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {CommonModule, DatePipe, DOCUMENT} from '@angular/common';
import {EmailUsers, EmailUsersVariables, UsersVariables} from '../../../shared/generated-types';
import {users} from '../../../shared/natural-search/natural-search-facets';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {emailUsersQuery} from '../services/user.queries';
import {UserService} from '../services/user.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    imports: [
        CommonModule,
        NaturalColumnsPickerComponent,
        NaturalSearchComponent,
        MatTableModule,
        MatSortModule,
        NaturalAvatarComponent,
        NaturalTableButtonComponent,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalFixedButtonComponent,
        RouterLink,
        NaturalEnumPipe,
        DatePipe,
    ],
})
export class UsersComponent extends NaturalAbstractList<UserService> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);
    private readonly apollo = inject(Apollo);
    private readonly document = inject(DOCUMENT);

    public override availableColumns: AvailableColumn[] = [
        {id: 'name', label: 'Nom'},
        {id: 'creationDate', label: 'Créé le'},
        {id: 'updateDate', label: 'Modifié le'},
        {id: 'membership', label: 'Membre des artisans'},
        {id: 'email', label: 'Email'},
        {id: 'phone', label: 'Téléphone', checked: false},
    ];

    public readonly buttons: Button[] = [
        {
            label: 'Copier...',
            icon: 'email',
            click: (button: Button): void => this.download(button),
            buttons: [
                {
                    label: 'Copier les e-mails',
                    disabled: true,
                    click: (): void => this.copy(this.usersEmail),
                },
                {
                    label: 'Copier les e-mails et les noms',
                    disabled: true,
                    click: (): void => this.copy(this.usersEmailAndName),
                },
            ],
        },
    ];

    public usersEmail: string | null = null;
    public usersEmailAndName: string | null = null;

    public constructor() {
        super(inject(UserService));

        this.naturalSearchFacets = users();
    }

    public override search(naturalSearchSelections: NaturalSearchSelections): void {
        this.usersEmail = null;
        this.usersEmailAndName = null;
        super.search(naturalSearchSelections);
    }

    private download(button: Button): void {
        const qvm = new NaturalQueryVariablesManager(this.variablesManager);
        qvm.set('pagination', {pagination: {pageIndex: 0, pageSize: 9999}});
        qvm.set('emailFilter', {
            filter: {groups: [{conditions: [{email: {null: {not: true}}}]}]},
        } satisfies UsersVariables);

        button.buttons?.forEach(subButton => (subButton.disabled = true));

        this.apollo
            .query<EmailUsers, EmailUsersVariables>({
                query: emailUsersQuery,
                variables: qvm.variables.value,
            })
            .subscribe(result => {
                this.usersEmail = result.data.users.items.map(u => u.email).join(' ;,'); // all separators for different mailboxes
                this.usersEmailAndName = result.data.users.items
                    .map(u => [u.email, u.firstName, u.lastName].join(';'))
                    .join('\n');

                button.buttons?.forEach(subButton => (subButton.disabled = false));
            });
    }

    private copy(text: string | null): void {
        if (text) {
            copyToClipboard(this.document, text);
        }
    }
}
