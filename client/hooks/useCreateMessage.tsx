import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  CreateMessageResponse,
  CreateMessagePayload,
  GetMessagesResponse,
} from '../constants/GQL_INTERFACE';

export function useCreateMessage() {
  const [createMessage, { data, error }] = useMutation<
    CreateMessageResponse,
    CreateMessagePayload
  >(GQL_QUERY.CREATE_MESSAGE_QUERY, {
    update(cache, { data }) {
      const newMessage = data?.createMessage;
      const existingMessages = cache.readQuery<GetMessagesResponse>({
        query: GQL_QUERY.GET_MESSAGES_QUERY,
        variables: {
          _room: newMessage?._room,
        },
      });
      if (existingMessages && newMessage) {
        cache.writeQuery({
          query: GQL_QUERY.GET_MESSAGES_QUERY,
          variables: {
            _room: newMessage?._room,
          },
          data: {
            getMessages: [...existingMessages?.getMessages, newMessage],
          },
        });
      }
    },
  });
  return { createMessage, data, error };
}
