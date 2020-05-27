import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {forkJoin} from 'rxjs';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {SessionSortingField, SessionsVariables, SortingOrder} from '../../../shared/generated-types';

@Component({
    selector: 'app-next-sessions',
    templateUrl: './next-sessions.component.html',
    styleUrls: ['./next-sessions.component.scss'],
})
export class NextSessionsComponent implements OnInit {
    /**
     * Regions to display in first step (in mat-select)
     */
    public regions: string[] = [];

    /**
     * List of only next session for each city matching the wanted region
     */
    public localities: {name: string; id: string}[] = [];

    constructor(private sessionService: SessionService, public router: Router, public route: ActivatedRoute) {}

    ngOnInit(): void {
        // Get regions
        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();
        const variables: SessionsVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                region: {group: {}}, // distinct
                                startDate: {greater: {value: new Date()}},
                            },
                        ],
                    },
                ],
            },
            pagination: {pageIndex: 0, pageSize: 999},
            sorting: [{field: SessionSortingField.region, order: SortingOrder.ASC}],
        };

        qvm.set('variables', variables);
        this.sessionService.getAll(qvm).subscribe(data => (this.regions = data.items.map(i => i.region)));

        this.fetchLocalitiesAndSessions();
    }

    /**
     * Get the next (in the future) session
     */
    public fetchLocalitiesAndSessions() {
        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();
        const localityVariables: SessionsVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                locality: {group: {}}, // distinct
                                startDate: {greaterOrEqual: {value: new Date()}},
                            },
                        ],
                    },
                ],
            },
            pagination: {pageIndex: 0, pageSize: 999},
            sorting: [
                {field: SessionSortingField.locality, order: SortingOrder.ASC},
                {field: SessionSortingField.startDate, order: SortingOrder.ASC},
            ],
        };

        qvm.set('variables', localityVariables);

        this.sessionService.getAll(qvm).subscribe(data => {
            // Query next session for each locality
            const observables = data.items.map(session => {
                const sessionVariables: SessionsVariables = {
                    filter: {
                        groups: [
                            {
                                conditions: [
                                    {
                                        locality: {equal: {value: session.locality}},
                                        startDate: {greaterOrEqual: {value: new Date()}},
                                    },
                                ],
                            },
                        ],
                    },
                    pagination: {pageIndex: 0, pageSize: 1}, // only the next one
                    sorting: [{field: SessionSortingField.startDate, order: SortingOrder.ASC}],
                };

                const localityQvm = new NaturalQueryVariablesManager<SessionsVariables>();
                localityQvm.set('variables', sessionVariables);

                return this.sessionService.getAll(localityQvm);
            });

            forkJoin(observables).subscribe(result => {
                const localities: {name: string; id: string}[] = [];

                result.forEach(sessionsResult => {
                    const session = sessionsResult.items.length ? sessionsResult.items[0] : null;
                    if (session) {
                        localities.push({name: session.locality, id: session.id});
                    }
                });

                this.localities = localities;
            });
        });
    }
}
