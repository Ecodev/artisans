import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
import { tagsQuery } from './tag.queries';
import { TagsQuery, TagsQueryVariables } from '../../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class TagService extends AbstractModelService<
    any,
    any,
    TagsQuery['tags'],
    TagsQueryVariables,
    any,
    any,
    any,
    any,
    any> {

    constructor(apollo: Apollo) {
        super(apollo, 'tag', null, tagsQuery, null, null, null);
    }

}
