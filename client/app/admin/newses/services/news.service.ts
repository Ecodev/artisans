import {Injectable} from '@angular/core';
import {Literal, NaturalAbstractModelService} from '@ecodev/natural';
import {Apollo} from 'apollo-angular';

import {
    CreateNews,
    CreateNewsVariables,
    DeleteNewses,
    News,
    Newses,
    NewsesVariables,
    NewsInput,
    NewsVariables,
    UpdateNews,
    UpdateNewsVariables,
} from '../../../shared/generated-types';
import {createNews, deleteNewses, newsesQuery, newsQuery, updateNews} from './news.queries';

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
    DeleteNewses['deleteNewses']
> {
    constructor(apollo: Apollo) {
        super(apollo, 'news', newsQuery, newsesQuery, createNews, updateNews, deleteNewses);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getInput(object: Literal) {
        object.content = object.content || '';
        return super.getInput(object);
    }

    public getDefaultForServer(): NewsInput {
        return {
            isActive: false,
            name: '',
            description: '',
            content: '',
            date: new Date(),
        };
    }
}
