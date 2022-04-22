import React from 'react';
import { useSubscription } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	UnsubscribeRoomResponse,
	RoomSubscriptionPayload,
	GetRoomsResponse,
	RoomData,
} from '../constants/GQL_INTERFACE';

export function useUnsubscribeRoom(payload) {
	const { data, loading, error } = useSubscription<
		UnsubscribeRoomResponse,
		RoomSubscriptionPayload
	>(GQL_QUERY.UNSUBSCRIBE_ROOM_QUERY, {
		variables: payload,
		onSubscriptionData: ({ client, subscriptionData }) => {
			const unsubscribedRoom = subscriptionData?.data?.unsubscribeRoom;
			const existingRooms = client.cache.readQuery<GetRoomsResponse>({
				query: GQL_QUERY.GET_ROOMS_QUERY,
				variables: {
					owner_user_id: payload.subscriber_id,
				},
			});

			if (unsubscribedRoom && existingRooms) {
				client.cache.writeQuery({
					query: GQL_QUERY.GET_ROOMS_QUERY,
					variables: {
						owner_user_id: payload.subscriber_id,
					},
					data: {
						getRooms: existingRooms.getRooms.reduce(
							(rooms: RoomData[], room) => {
								if (room._id !== unsubscribedRoom._id) {
									rooms.push(room);
								} else {
									rooms.push(unsubscribedRoom);
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
	return { data, loading, error };
}
