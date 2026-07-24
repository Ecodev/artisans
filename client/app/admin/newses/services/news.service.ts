import {Injectable} from '@angular/core';
import {formatIsoDateTime, type FormValidators, type Literal, NaturalAbstractModelService} from '@ecodev/natural';
import {
    type CreateNews,
    type CreateNewsVariables,
    type DeleteNewses,
    type DeleteNewsesVariables,
    type NewsesQuery,
    type NewsesQueryVariables,
    type NewsInput,
    type NewsPartialInput,
    type NewsQuery,
    type NewsQueryVariables,
    type UpdateNews,
    type UpdateNewsVariables,
} from '../../../shared/generated-types';
import {createNews, deleteNewses, newsesQuery, newsQuery, updateNews} from './news.queries';
import {Validators} from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class NewsService extends NaturalAbstractModelService<
    NewsQuery['news'],
    NewsQueryVariables,
    NewsesQuery['newses'],
    NewsesQueryVariables,
    CreateNews['createNews'],
    CreateNewsVariables,
    UpdateNews['updateNews'],
    UpdateNewsVariables,
    DeleteNewses,
    DeleteNewsesVariables
> {
    public constructor() {
        super('news', newsQuery, newsesQuery, createNews, updateNews, deleteNewses);
    }

    public override getInput(object: Literal, forCreation: boolean): NewsInput | NewsPartialInput {
        object.content = object.content || '';
        return super.getInput(object, forCreation);
    }

    public override getDefaultForServer(): NewsInput {
        return {
            isActive: false,
            name: '',
            description: '',
            content: '',
            date: formatIsoDateTime(new Date()),
        };
    }

    public override getFormValidators(): FormValidators {
        return {
            name: [Validators.required],
            date: [Validators.required],
        };
    }
}
