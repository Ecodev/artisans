import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';

import {
    Comment,
    CommentInput,
    Comments,
    CommentsVariables,
    CommentVariables,
    CreateComment,
    CreateCommentVariables,
    DeleteComments,
    UpdateComment,
    UpdateCommentVariables,
} from '../../../shared/generated-types';
import { commentQuery, commentsQuery, createComment, deleteComments, updateComment } from './comment.queries';

@Injectable({
    providedIn: 'root',
})
export class CommentService
    extends NaturalAbstractModelService<Comment['comment'],
        CommentVariables,
        Comments['comments'],
        CommentsVariables,
        CreateComment['createComment'],
        CreateCommentVariables,
        UpdateComment['updateComment'],
        UpdateCommentVariables,
        DeleteComments['deleteComments']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'comment',
            commentQuery,
            commentsQuery,
            createComment,
            updateComment,
            deleteComments);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): CommentInput {
        return {
            description: '',
            event: null,
            news: null,
        };
    }

}
