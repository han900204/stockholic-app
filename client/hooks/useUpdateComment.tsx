import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  UpdateCommentResponse,
  UpdateCommentPayload,
  GetCommentsResponse,
  CommentData,
} from '../constants/GQL_INTERFACE';

export function useUpdateComment() {
  const [updateComment, { data, error }] = useMutation<
    UpdateCommentResponse,
    UpdateCommentPayload
  >(GQL_QUERY.UPDATE_COMMENT_QUERY, {
    update(cache, { data }) {
      const updatedComment = data?.updateComment;
      const existingComments = cache.readQuery<GetCommentsResponse>({
        query: GQL_QUERY.GET_COMMENTS_QUERY,
        variables: {
          forum_id: updatedComment?.forum_id,
        },
      });
      if (existingComments && updatedComment) {
        cache.writeQuery({
          query: GQL_QUERY.GET_COMMENTS_QUERY,
          variables: {
            forum_id: updatedComment?.forum_id,
          },
          data: {
            getComments: existingComments?.getComments.reduce(
              (comments: CommentData[], comment) => {
                if (comment.id !== updatedComment.id) {
                  comments.push(comment);
                } else {
                  comments.push(updatedComment);
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
  return { updateComment, data, error };
}
