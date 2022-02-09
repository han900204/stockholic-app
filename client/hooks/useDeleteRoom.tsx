import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  DeleteRoomResponse,
  DeleteRoomPayload,
  GetRoomsResponse,
  RoomData,
} from '../constants/GQL_INTERFACE';

export function useDeleteRoom() {
  const [deleteRoom, { data, error }] = useMutation<
    DeleteRoomResponse,
    DeleteRoomPayload
  >(GQL_QUERY.DELETE_ROOM_QUERY, {
    update(cache, { data }) {
      const deletedRoom = data?.deleteRoom;
      const existingRooms = cache.readQuery<GetRoomsResponse>({
        query: GQL_QUERY.GET_ROOMS_QUERY,
        variables: {
          owner_user_id: deletedRoom?.owner_user_id,
        },
      });
      if (existingRooms && deletedRoom) {
        cache.writeQuery({
          query: GQL_QUERY.GET_ROOMS_QUERY,
          variables: {
            owner_user_id: deletedRoom?.owner_user_id,
          },
          data: {
            getRooms: existingRooms?.getRooms.reduce(
              (rooms: RoomData[], room) => {
                if (room._id !== deletedRoom._id) {
                  rooms.push(room);
                }
                return rooms;
              },
              []
            ),
          },
        });
      }
    },
  });
  return { deleteRoom, data, error };
}
