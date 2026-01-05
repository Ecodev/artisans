import {Injectable} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {
    CommentQuery,
    CommentInput,
    CommentsQuery,
    CommentsQueryVariables,
    CommentQueryVariables,
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
    CommentQuery['comment'],
    CommentQueryVariables,
    CommentsQuery['comments'],
    CommentsQueryVariables,
    CreateComment['createComment'],
    CreateCommentVariables,
    UpdateComment['updateComment'],
    UpdateCommentVariables,
    DeleteComments,
    DeleteCommentsVariables
> {
    public constructor() {
        super('comment', commentQuery, commentsQuery, createComment, updateComment, deleteComments);
    }

    public override getDefaultForServer(): CommentInput {
        return {
            description: '',
            event: null,
            news: null,
        };
    }
}
