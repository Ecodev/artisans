import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {
    formatIsoDateTime,
    FormValidators,
    Literal,
    NaturalAbstractModelService,
    NaturalDebounceService,
} from '@ecodev/natural';
import {
    CreateNews,
    CreateNewsVariables,
    DeleteNewses,
    DeleteNewsesVariables,
    News,
    Newses,
    NewsesVariables,
    NewsInput,
    NewsPartialInput,
    NewsVariables,
    UpdateNews,
    UpdateNewsVariables,
} from '../../../shared/generated-types';
import {createNews, deleteNewses, newsesQuery, newsQuery, updateNews} from './news.queries';
import {Validators} from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class NewsService extends NaturalAbstractModelService<
    News['news'],
    NewsVariables,
    Newses['newses'],
    NewsesVariables,
    CreateNews['createNews'],
    CreateNewsVariables,
    UpdateNews['updateNews'],
    UpdateNewsVariables,
    DeleteNewses,
    DeleteNewsesVariables
> {
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(apollo, naturalDebounceService, 'news', newsQuery, newsesQuery, createNews, updateNews, deleteNewses);
    }

    public getDefaultForClient(): Literal {
        return this.getDefaultForServer();
    }

    public getInput(object: Literal): NewsInput | NewsPartialInput {
        object.content = object.content || '';
        return super.getInput(object);
    }

    public getDefaultForServer(): NewsInput {
        return {
            isActive: false,
            name: '',
            description: '',
            content: '',
            date: formatIsoDateTime(new Date()),
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required],
            date: [Validators.required],
        };
    }
}
