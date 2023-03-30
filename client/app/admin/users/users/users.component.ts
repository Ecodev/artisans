import {Apollo} from 'apollo-angular';
import {Component, Inject, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
    AvailableColumn,
    copyToClipboard,
    NaturalAbstractList,
    NaturalQueryVariablesManager,
    NaturalSearchSelections,
} from '@ecodev/natural';
import {EmailUsers, EmailUsersVariables, UsersVariables} from '../../../shared/generated-types';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {emailUsersQuery} from '../services/user.queries';
import {UserService} from '../services/user.service';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends NaturalAbstractList<UserService> implements OnInit {
    public override availableColumns: AvailableColumn[] = [
        {id: 'name', label: 'Nom'},
        {id: 'creationDate', label: 'Créé le'},
        {id: 'updateDate', label: 'Modifié le'},
        {id: 'membership', label: 'Membre des artisans'},
        {id: 'email', label: 'Email'},
        {id: 'phone', label: 'Téléphone', checked: false},
    ];

    public usersEmail: string | null = null;
    public usersEmailAndName: string | null = null;

    public constructor(
        route: ActivatedRoute,
        private readonly userService: UserService,
        injector: Injector,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
        private readonly apollo: Apollo,
        @Inject(DOCUMENT) private readonly document: Document,
    ) {
        super(userService, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('users');
    }

    public override search(naturalSearchSelections: NaturalSearchSelections): void {
        this.usersEmail = null;
        this.usersEmailAndName = null;
        super.search(naturalSearchSelections);
    }

    public download(): void {
        const qvm = new NaturalQueryVariablesManager(this.variablesManager);
        qvm.set('pagination', {pagination: {pageIndex: 0, pageSize: 9999}});
        qvm.set('emailFilter', {
            filter: {groups: [{conditions: [{email: {null: {not: true}}}]}]},
        } satisfies UsersVariables);

        this.apollo
            .query<EmailUsers, EmailUsersVariables>({
                query: emailUsersQuery,
                variables: qvm.variables.value,
            })
            .subscribe(result => {
                this.usersEmail = result.data['users'].items.map(u => u.email).join(' ;,'); // all separators for different mailboxes
                this.usersEmailAndName = result.data['users'].items
                    .map(u => [u.email, u.firstName, u.lastName].join(';'))
                    .join('\n');
            });
    }

    public copy(text: string): void {
        copyToClipboard(this.document, text);
    }
}
