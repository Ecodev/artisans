import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Literal, NaturalAbstractModelService, NaturalDebounceService} from '@ecodev/natural';
import {
    Comment,
    CommentInput,
    Comments,
    CommentsVariables,
    CommentVariables,
    CreateComment,
    CreateCommentVariables,
    DeleteComments,
    DeleteCommentsVariables,
    UpdateComment,
    UpdateCommentVariables,
} from '../../../shared/generated-types';
import {commentQuery, commentsQuery, createComment, deleteComments, updateComment} from './comment.queries';

@Injectable({
    providedIn: 'root',
})
export class CommentService extends NaturalAbstractModelService<
    Comment['comment'],
    CommentVariables,
    Comments['comments'],
    CommentsVariables,
    CreateComment['createComment'],
    CreateCommentVariables,
    UpdateComment['updateComment'],
    UpdateCommentVariables,
    DeleteComments,
    DeleteCommentsVariables
> {
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(
            apollo,
            naturalDebounceService,
            'comment',
            commentQuery,
            commentsQuery,
            createComment,
            updateComment,
            deleteComments,
        );
    }

    protected override getDefaultForClient(): Literal {
        return this.getDefaultForServer();
    }

    protected override getDefaultForServer(): CommentInput {
        return {
            description: '',
            event: null,
            news: null,
        };
    }
}
