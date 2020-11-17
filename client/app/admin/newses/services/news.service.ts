import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Literal, NaturalAbstractModelService} from '@ecodev/natural';
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
    constructor(apollo: Apollo) {
        super(apollo, 'news', newsQuery, newsesQuery, createNews, updateNews, deleteNewses);
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
            date: new Date(),
        };
    }
}
