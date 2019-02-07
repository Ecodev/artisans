import { Component, OnInit } from '@angular/core';
import { LogicalOperator, UsersQueryVariables } from '../../../shared/generated-types';
import { UserService } from '../../../admin/users/services/user.service';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { ActivatedRoute } from '@angular/router';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { mergeWith } from 'lodash';

@Component({
    selector: 'app-family',
    templateUrl: './family.component.html',
    styleUrls: ['./family.component.scss'],
})
export class FamilyComponent implements OnInit {

    public user;
    private familyMembers;

    constructor(public userService: UserService,
                private route: ActivatedRoute,
                private alertService: AlertService,
                public permissionsService: PermissionsService) {

    }

    ngOnInit() {

        this.user = this.route.snapshot.data.user.model;

        if (this.user) {
            const variables = new QueryVariablesManager<UsersQueryVariables>();
            const filters: UsersQueryVariables = {
                filter: {
                    groups: [
                        {
                            conditionsLogic: LogicalOperator.OR,
                            conditions: [
                                {owner: {equal: {value: this.user.id}}},
                                {id: {equal: {value: this.user.id}}},
                            ],
                        },
                    ],
                },
            };
            variables.set('variables', filters);
            this.userService.getAll(variables).subscribe(familyMembers => this.familyMembers = familyMembers ? familyMembers.items : null);
        }

    }

    public add() {
        const emptyUser = this.userService.getEmptyObject();
        this.familyMembers.push(emptyUser);
    }

    public leaveFamily(): void {
        const explanation = `En quittant le ménage vous perdrez les privilèges associés au ménage.
        Il vous faudra alors faire une demande d'adhésion en tant que membre indépendant pour retrouver ces privilièges.`;
        this.alertService.confirm('Quitter le ménage', explanation, 'Quitter le ménage')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.userService.leaveFamily(this.user).subscribe(user => {

                        mergeWith(this.user, user, AbstractModelService.mergeOverrideArray);
                        const message = 'Vous avez quitté le ménage';
                        this.alertService.info(message, 5000);
                    });
                }
            });
    }
}
