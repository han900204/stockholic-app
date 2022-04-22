import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  UpdateForumResponse,
  UpdateForumPayload,
  GetForumResponse,
} from '../constants/GQL_INTERFACE';

export function useUpdateForum() {
  const [updateForum, { data, error }] = useMutation<
    UpdateForumResponse,
    UpdateForumPayload
  >(GQL_QUERY.UPDATE_FORUM_QUERY, {
    update(cache, { data }) {
      const updatedForum = data?.updateForum;
      const existingForum = cache.readQuery<GetForumResponse>({
        query: GQL_QUERY.GET_FORUM_QUERY,
      });
      if (existingForum && updatedForum) {
        cache.writeQuery({
          query: GQL_QUERY.GET_FORUM_QUERY,
          data: {
            getForum: { ...existingForum?.getForum, ...updatedForum },
          },
        });
      }
    },
  });
  return { updateForum, data, error };
}
