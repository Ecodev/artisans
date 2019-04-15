import { Component, OnInit } from '@angular/core';
import { UsersVariables } from '../../../shared/generated-types';
import { UserService } from '../../../admin/users/services/user.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../natural/components/alert/alert.service';
import { mergeWith } from 'lodash';
import { QueryVariablesManager } from '../../../natural/classes/QueryVariablesManager';
import { AbstractModelService } from '../../../natural/services/abstract-model.service';

@Component({
    selector: 'app-family',
    templateUrl: './family.component.html',
    styleUrls: ['./family.component.scss'],
})
export class FamilyComponent implements OnInit {

    public viewer;
    private familyMembers;

    constructor(public userService: UserService,
                private route: ActivatedRoute,
                private alertService: AlertService,
                public permissionsService: PermissionsService) {

    }

    ngOnInit() {

        this.viewer = this.route.snapshot.data.viewer.model;

        if (this.viewer) {
            const qvm = new QueryVariablesManager<UsersVariables>();
            qvm.set('variables', UserService.getFamilyVariables(this.viewer));
            this.userService.getAll(qvm).subscribe(members => this.familyMembers = members.items);
        }

    }

    public add() {
        const emptyUser = this.userService.getEmptyObject();
        this.familyMembers.push(emptyUser);
    }

    public canEdit(familyMember) {
        return !this.viewer.owner || this.viewer.id === familyMember.id;
    }

    public leaveFamily(): void {
        const explanation = `En quittant le ménage vous perdrez les privilèges associés au ménage.
        Il vous faudra alors faire une demande d'adhésion en tant que membre indépendant pour retrouver ces privilièges.`;
        this.alertService.confirm('Quitter le ménage', explanation, 'Quitter le ménage')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.userService.leaveFamily(this.viewer).subscribe(user => {

                        mergeWith(this.viewer, user, AbstractModelService.mergeOverrideArray);
                        const message = 'Vous avez quitté le ménage';
                        this.alertService.info(message, 5000);
                    });
                }
            });
    }
}
