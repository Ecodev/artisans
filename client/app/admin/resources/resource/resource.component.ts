import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { ResourceService } from '../services/resource.service';
import {
    CreateResourceMutation,
    CreateResourceMutationVariables,
    ResourceQuery,
    ResourceQueryVariables,
    UpdateResourceMutation,
    UpdateResourceMutationVariables,
} from '../../../shared/generated-types';
import { TagService } from '../../tags/services/tag.service';

@Component({
    selector: 'app-action',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss'],
})
export class ResourceComponent
    extends AbstractDetail<ResourceQuery['resource'],
        ResourceQueryVariables,
        CreateResourceMutation['createResource'],
        CreateResourceMutationVariables,
        UpdateResourceMutation['updateResource'],
        UpdateResourceMutationVariables,
        any> {

    constructor(alertService: AlertService,
                resourceService: ResourceService,
                router: Router,
                route: ActivatedRoute,
                public tagService: TagService
    ) {
        super('resource', resourceService, alertService, router, route);
    }
}
