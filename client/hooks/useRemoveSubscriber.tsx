import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  RemoveSubscriberResponse,
  RemoveSubscriberPayload,
  GetRoomsResponse,
} from '../constants/GQL_INTERFACE';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';

export function useRemoveSubscriber() {
  const {
    investorId,
  }: {
    investorId: number | null;
  } = useSelector((state: RootState) => state.investor);

  const [removeSubscriber, { data, error }] = useMutation<
    RemoveSubscriberResponse,
    RemoveSubscriberPayload
  >(GQL_QUERY.REMOVE_SUBSCRIBER_QUERY, {
    update(cache, { data }) {
      const updatedRoom = data?.removeSubscriber;
      const existingRooms = cache.readQuery<GetRoomsResponse>({
        query: GQL_QUERY.GET_ROOMS_QUERY,
        variables: {
          owner_user_id: investorId,
        },
      });
      if (existingRooms && updatedRoom) {
        const updatedRooms = existingRooms.getRooms.filter(
          (room) => room._id !== updatedRoom._id
        );
        cache.writeQuery({
          query: GQL_QUERY.GET_ROOMS_QUERY,
          variables: {
            owner_user_id: investorId,
          },
          data: {
            getRooms: updatedRooms,
          },
        });
      }
    },
  });
  return { removeSubscriber, data, error };
}
