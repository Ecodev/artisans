import { Component, Input, OnInit } from '@angular/core';
import { LogicalOperator, UserQuery, UsersQueryVariables } from '../../../shared/generated-types';
import { UserService } from '../../../admin/users/services/user.service';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';

@Component({
    selector: 'app-family',
    templateUrl: './family.component.html',
    styleUrls: ['./family.component.scss'],
})
export class FamilyComponent implements OnInit {

    @Input() responsible: UserQuery['user'];

    private familyMembers;

    constructor(private userService: UserService) {
    }

    ngOnInit() {

        if (this.responsible) {
            const variables = new QueryVariablesManager<UsersQueryVariables>();
            const filters: UsersQueryVariables = {
                filter: {
                    groups: [
                        {
                            conditionsLogic: LogicalOperator.OR,
                            conditions: [
                                {responsible: {equal: {value: this.responsible.id}}},
                                {id: {equal: {value: this.responsible.id}}},
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

}
