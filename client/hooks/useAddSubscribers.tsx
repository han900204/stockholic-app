import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	AddSubscribersResponse,
	AddSubscribersPayload,
	GetRoomsResponse,
} from '../constants/GQL_INTERFACE';

export function useAddSubscribers() {
	const [addSubscribers, { data, error }] = useMutation<
		AddSubscribersResponse,
		AddSubscribersPayload
	>(GQL_QUERY.ADD_SUBSCRIBERS_QUERY, {
		update(cache, { data }) {
			const updatedRoom = data?.addSubscribers;
			const existingRooms = cache.readQuery<GetRoomsResponse>({
				query: GQL_QUERY.GET_ROOMS_QUERY,
				variables: {
					owner_user_id: updatedRoom?.owner_user_id,
				},
			});
			if (existingRooms && updatedRoom) {
				const updatedRooms = existingRooms.getRooms.map((room) => {
					if (room._id === updatedRoom._id) return updatedRoom;
					else return room;
				});
				cache.writeQuery({
					query: GQL_QUERY.GET_ROOMS_QUERY,
					variables: {
						owner_user_id: updatedRoom.owner_user_id,
					},
					data: {
						getRooms: updatedRooms,
					},
				});
			}
		},
	});
	return { addSubscribers, data, error };
}
