import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  UpdateForumResponse,
  UpdateForumPayload,
  GetForumResponse,
} from '../constants/GQL_INTERFACE';

export function useCreateForum() {
  const [updateForum, { data, error }] = useMutation<
    UpdateForumResponse,
    UpdateForumPayload
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
