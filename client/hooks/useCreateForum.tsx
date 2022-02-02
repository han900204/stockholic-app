import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  CreateForumPayload,
  CreateForumResponse,
  GetForumsResponse,
} from '../constants/GQL_INTERFACE';

export function useCreateForum() {
  const [createForum, { data, error }] = useMutation<
    CreateForumResponse,
    CreateForumPayload
  >(GQL_QUERY.CREATE_FORUM_QUERY, {
    update(cache, { data }) {
      const newForum = data?.createForum;
      const existingForums = cache.readQuery<GetForumsResponse>({
        query: GQL_QUERY.GET_FORUMS_QUERY,
      });

      console.log(newForum, existingForums?.getForums);
      if (existingForums && newForum) {
        cache.writeQuery({
          query: GQL_QUERY.GET_FORUMS_QUERY,
          data: {
            getForums: [newForum, ...existingForums?.getForums],
          },
        });
      }
    },
  });
  return { createForum, data, error };
}
