import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
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
    public nextSessions: Sessions_sessions_items[] = [];

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
            this.nextSessions = [];
            this.selectedRegion = params.region;

            if (params.region) {
                this.getLocalities(params.region);
            }

        });
    }

    public goToRegion(region: string) {
        this.router.navigateByUrl('/prochaines-conversations-carbone/' + region);
    }

    public getLocalities(region: string) {

        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();
        const variables: SessionsVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                region: {equal: {value: region}},
                                locality: {group: {}}, // distinct
                                startDate: {greater: {value: new Date()}},
                            },
                        ],
                    },
                ],
            },
            pagination: {pageIndex: 0, pageSize: 999},
            sorting: [
                {field: SessionSortingField.startDate, order: SortingOrder.ASC},
                {field: SessionSortingField.locality, order: SortingOrder.ASC},
            ],
        };

        qvm.set('variables', variables);

        return this.sessionService.getAll(qvm).subscribe(data => {
            this.nextSessions = data.items;
        });
    }

}
