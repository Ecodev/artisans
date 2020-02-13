import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractList } from '@ecodev/natural';
import { UserTags, UserTagsVariables } from '../../../shared/generated-types';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { UserTagService } from '../services/user-tag.service';

@Component({
    selector: 'app-user-tags',
    templateUrl: './user-tags.component.html',
    styleUrls: ['./user-tags.component.scss'],
})
export class UserTagsComponent extends NaturalAbstractList<UserTags['userTags'], UserTagsVariables> implements OnInit {

    constructor(userTagService: UserTagService,
                injector: Injector,
                public permissionsService: PermissionsService,
    ) {

        super(userTagService, injector);

    }
}