import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
import { forkJoin } from 'rxjs';
import { SessionService } from '../../../admin/sessions/services/session.service';
import { Sessions_sessions_items, SessionSortingField, SessionsVariables, SortingOrder } from '../../../shared/generated-types';

@Component({
    selector: 'app-next-sessions',
    templateUrl: './next-sessions.component.html',
    styleUrls: ['./next-sessions.component.scss'],
})
export class NextSessionsComponent implements OnInit {

    /**
     * Selected region from select or url
     */
    public selectedRegion: string;

    /**
     * Regions to display in first step (in mat-select)
     */
    public regions: string[] = [];

    /**
     * List of only next session for each city matching the wanted region
     */
    public localities: string[] = [];

    /**
     * Stores next session for each locality
     */
    public nextSessionByRegion: Map<string, Sessions_sessions_items> = new Map();

    constructor(private sessionService: SessionService, public router: Router, public route: ActivatedRoute) {
    }

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
        this.sessionService.getAll(qvm).subscribe(data => this.regions = data.items.map(i => i.region));

        this.route.params.subscribe(params => {

            this.nextSessionByRegion = new Map();

            this.selectedRegion = params.region;

            if (params.region) {
                this.fetchLocalitiesAndSessions(params.region);
            }

        });
    }

    public goToRegion(region: string) {
        this.router.navigateByUrl('/agir-avec-nous/prochaines-conversations-carbone/' + region);
    }

    /**
     * Get the next (in the future) session
     */
    public fetchLocalitiesAndSessions(region: string) {

        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();
        const localityVariables: SessionsVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                region: {equal: {value: region}},
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

            // List localities names
            this.localities = data.items.map(i => i.locality);

            // Query next session for each locality
            const observables = this.localities.map(locality => {

                const sessionVariables: SessionsVariables = {
                    filter: {
                        groups: [{conditions: [{locality: {equal: {value: locality}}, startDate: {greaterOrEqual: {value: new Date()}}}]}],
                    },
                    pagination: {pageIndex: 0, pageSize: 1}, // only the next one
                    sorting: [{field: SessionSortingField.startDate, order: SortingOrder.ASC}],
                };

                const localityQvm = new NaturalQueryVariablesManager<SessionsVariables>();
                localityQvm.set('variables', sessionVariables);

                return this.sessionService.getAll(localityQvm);
            });

            forkJoin(observables).subscribe(result => {
                result.forEach(sessionsResult => {
                    const session = sessionsResult.items.length ? sessionsResult.items[0] : null;
                    if (session) {
                        this.nextSessionByRegion.set(session.locality, session);
                    }
                });
            });

        });
    }

}
