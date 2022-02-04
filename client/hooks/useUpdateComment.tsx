import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  UpdateCommentResponse,
  UpdateCommentPayload,
  GetCommentsResponse,
} from '../constants/GQL_INTERFACE';

export function useUpdateComment() {
  const [updateComment, { data, error }] = useMutation<
    UpdateCommentResponse,
    UpdateCommentPayload
  >(GQL_QUERY.UPDATE_FORUM_QUERY, {
    update(cache, { data }) {
      const newForum = data?.updateForum;
      const existingForum = cache.readQuery<GetForumResponse>({
        query: GQL_QUERY.GET_FORUM_QUERY,
      });
      if (existingForum && newForum) {
        cache.writeQuery({
          query: GQL_QUERY.GET_FORUM_QUERY,
          data: {
            getForum: { ...existingForum?.getForum, ...newForum },
          },
        });
      }
    },
  });
  return { updateForum, data, error };
}
