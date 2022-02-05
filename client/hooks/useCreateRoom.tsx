import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  CreateRoomResponse,
  CreateRoomPayload,
  GetRoomsResponse,
} from '../constants/GQL_INTERFACE';

export function useCreateRoom() {
  const [createRoom, { data, error }] = useMutation<
    CreateRoomResponse,
    CreateRoomPayload
  >(GQL_QUERY.CREATE_ROOM_QUERY, {
    update(cache, { data }) {
      const newRoom = data?.createRoom;
      const existingRooms = cache.readQuery<GetRoomsResponse>({
        query: GQL_QUERY.GET_ROOMS_QUERY,
      });
      if (existingRooms && newRoom) {
        cache.writeQuery({
          query: GQL_QUERY.GET_ROOMS_QUERY,
          data: {
            getForums: [...existingRooms?.getRooms, newRoom],
          },
        });
      }
    },
  });
  return { createRoom, data, error };
}
