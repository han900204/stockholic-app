import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  DeleteForumResponse,
  DeleteForumPayload,
  GetForumsResponse,
  ForumData,
} from '../constants/GQL_INTERFACE';

export function useDeleteForum() {
  const [deleteForum, { data, error }] = useMutation<
    DeleteForumResponse,
    DeleteForumPayload
  >(GQL_QUERY.DELETE_FORUM_QUERY, {
    update(cache, { data }) {
      const deletedForum = data?.deleteForum;
      const existingForums = cache.readQuery<GetForumsResponse>({
        query: GQL_QUERY.GET_FORUMS_QUERY,
      });
      console.log(deletedForum, existingForums);
      if (existingForums && deletedForum) {
        cache.writeQuery({
          query: GQL_QUERY.GET_FORUMS_QUERY,
          data: {
            getForums: existingForums?.getForums.reduce(
              (forums: ForumData[], forum) => {
                if (forum.id !== deletedForum.id) {
                  forums.push(forum);
                }
                return forums;
              },
              []
            ),
          },
        });
      }
    },
  });
  return { deleteForum, data, error };
}
