import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  CreateCommentPayload,
  CreateCommentResponse,
  GetCommentsResponse,
} from '../constants/GQL_INTERFACE';

export function useCreateComment() {
  const [createComment, { data, error }] = useMutation<
    CreateCommentResponse,
    CreateCommentPayload
  >(GQL_QUERY.CREATE_COMMENT_QUERY, {
    update(cache, { data }) {
      const newComment = data?.createComment;
      const existingComments = cache.readQuery<GetCommentsResponse>({
        query: GQL_QUERY.GET_COMMENTS_QUERY,
      });
      if (existingComments && newComment) {
        cache.writeQuery({
          query: GQL_QUERY.GET_COMMENTS_QUERY,
          data: {
            getComments: [newComment, ...existingComments?.getComments],
          },
        });
      }
    },
  });
  return { createComment, data, error };
}
