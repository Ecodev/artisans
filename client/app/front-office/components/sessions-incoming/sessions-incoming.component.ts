import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {NaturalAlertService, NaturalQueryVariablesManager} from '@ecodev/natural';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {UserService} from '../../../admin/users/services/user.service';
import {
    Sessions_sessions_items,
    SessionSortingField,
    SessionsVariables,
    SortingOrder,
} from '../../../shared/generated-types';
import {EmailsComponent} from '../../modules/shop/components/emails/emails.component';

@Component({
    selector: 'app-sessions-incoming',
    templateUrl: './sessions-incoming.component.html',
    styleUrls: ['./sessions-incoming.component.scss'],
})
export class SessionsIncomingComponent implements OnInit {
    public sessions: Sessions_sessions_items[] = [];

    public queues: {mailingList: string; name: string}[] = [
        {name: 'Région Bienne', mailingList: '61355'},
        {name: 'Région Neuchâtel', mailingList: '61357'},
        {name: 'Région Fribourg', mailingList: '61356'},
        {name: 'Région Genève', mailingList: '61350'},
        {name: 'Région Jura', mailingList: '61358'},
        {name: 'Région Vaud (hors Nord et Est vaudois)', mailingList: '61362'},
        {name: 'Région Nord vaudois', mailingList: '61361'},
        {name: 'Région Est vaudois et bas Valais', mailingList: '61363'},
        {name: 'Région Valais central', mailingList: '61360'},
    ];

    constructor(
        private sessionService: SessionService,
        public router: Router,
        public route: ActivatedRoute,
        public userService: UserService,
        public dialog: MatDialog,
        public alertService: NaturalAlertService,
        private snackbar: MatSnackBar,
    ) {}

    public ngOnInit(): void {
        // Get sessions
        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();

        qvm.set('variables', {
            filter: {groups: [{conditions: [{startDate: {greater: {value: new Date()}}}]}]},
            pagination: {pageIndex: 0, pageSize: 999},
            sorting: [{field: SessionSortingField.name, order: SortingOrder.ASC}],
        });

        this.sessionService.getAll(qvm).subscribe(data => (this.sessions = data.items));
    }

    public subscribeToQueue(queue: {mailingList: string; name: string}) {
        this.subscribe(
            queue,
            'Être averti pour : ',
            "Je confirme vouloir être informé d'un nouvel événement : ",
            'Être averti',
        );
    }

    public subscribe(
        session: {mailingList: string; name: string},
        loggedOutModalTitle: string,
        loggedInConfirmMessage: string,
        confirmMessage: string,
    ) {
        const subscribeFn = (email: string) => {
            this.userService.addToMailingList(session.mailingList, email).subscribe(() => {});
            this.snackbar.open('Inscription confirmée', undefined, {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
            });
        };

        const viewer = this.route.snapshot.data.viewer?.model;

        if (viewer) {
            // If logged in, confirm with user e-mail
            this.alertService
                .confirm('Confirmer', loggedInConfirmMessage + session.name, confirmMessage)
                .subscribe(result => {
                    if (result) {
                        subscribeFn(viewer.email);
                    }
                });
        } else {
            // If logged out, ask for e-mail. This modal is a kind of confirmation.
            const dialogData: MatDialogConfig = {data: {title: loggedOutModalTitle + session.name}};

            this.dialog
                .open(EmailsComponent, dialogData)
                .afterClosed()
                .subscribe(result => {
                    if (result) {
                        subscribeFn(result[0]);
                    }
                });
        }
    }
}
