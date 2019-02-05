import { Component, OnInit } from '@angular/core';
import { UserRole } from '../../../shared/generated-types';
import { ActivatedRoute } from '@angular/router';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
import { AccountService } from '../../../admin/accounts/services/account.service';
import { mergeWith } from 'lodash';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { UserService } from '../../../admin/users/services/user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

    public user;

    constructor(private userService: UserService,
                private alertService: AlertService,
                private route: ActivatedRoute,
                public bookableService: BookableService,
                public accountService: AccountService) {
    }

    ngOnInit() {

        this.user = this.route.snapshot.data.user.model;

    }

    public canLeaveFamily() {
        return this.user.owner && this.user.owner.id !== this.user.id;
    }

    public unregister(): void {
        this.alertService.confirm('Démission', 'Voulez-vous quitter le club Ichtus ?', 'Démissioner définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.userService.unregister(this.user).subscribe(() => {
                        const message = 'Vous avez démissioné';
                        this.alertService.info(message, 5000);
                        this.userService.logout();
                    });
                }
            });
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

    public showBecomeMember() {
        const isMember = [UserRole.member, UserRole.responsible, UserRole.administrator].indexOf(this.user.role) > -1;
        const isOwner = !this.user.owner;

        return !isMember && !isOwner;
    }

}
