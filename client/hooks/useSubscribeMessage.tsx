import React from 'react';
import { useSubscription } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  SubscribeMessageResponse,
  SubscribeMessagePayload,
  GetMessagesResponse,
} from '../constants/GQL_INTERFACE';

export function useSubscribeMessage(payload) {
  const { data, loading, error } = useSubscription<
    SubscribeMessageResponse,
    SubscribeMessagePayload
  >(GQL_QUERY.SUBSCRIBE_MESSAGE, {
    variables: payload,
    onSubscriptionData: ({ client, subscriptionData }) => {
      const newMessage = subscriptionData?.data?.subscribeMessage;
      const existingMessages = client.cache.readQuery<GetMessagesResponse>({
        query: GQL_QUERY.GET_MESSAGES_QUERY,
        variables: {
          _room: newMessage?._room,
        },
      });

      if (existingMessages && newMessage) {
        client.cache.writeQuery({
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
  return { data, loading, error };
}
