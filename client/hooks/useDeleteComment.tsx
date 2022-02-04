import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  DeleteCommentResponse,
  DeleteCommentPayload,
  GetCommentsResponse,
  CommentData,
} from '../constants/GQL_INTERFACE';

export function useDeleteComment() {
  const [deleteComment, { data, error }] = useMutation<
    DeleteCommentResponse,
    DeleteCommentPayload
  >(GQL_QUERY.DELETE_COMMENT_QUERY, {
    update(cache, { data }) {
      const deletedComment = data?.deleteComment;
      const existingComments = cache.readQuery<GetCommentsResponse>({
        query: GQL_QUERY.GET_COMMENTS_QUERY,
        variables: {
          forum_id: deletedComment?.forum_id,
        },
      });
      if (existingComments && deletedComment) {
        cache.writeQuery({
          query: GQL_QUERY.GET_COMMENTS_QUERY,
          variables: {
            forum_id: deletedComment?.forum_id,
          },
          data: {
            getComments: existingComments?.getComments.reduce(
              (comments: CommentData[], comment) => {
                if (comment.id !== deletedComment.id) {
                  comments.push(comment);
                }
                return comments;
              },
              []
            ),
          },
        });
      }
    },
  });
  return { deleteComment, data, error };
}
