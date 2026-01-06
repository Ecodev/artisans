import {Injectable} from '@angular/core';
import {formatIsoDateTime, FormValidators, Literal, NaturalAbstractModelService} from '@ecodev/natural';
import {
    CreateNews,
    CreateNewsVariables,
    DeleteNewses,
    DeleteNewsesVariables,
    NewsesQuery,
    NewsesQueryVariables,
    NewsInput,
    NewsPartialInput,
    NewsQuery,
    NewsQueryVariables,
    UpdateNews,
    UpdateNewsVariables,
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
