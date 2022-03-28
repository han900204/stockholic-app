import React from 'react';
import { useSubscription } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	SubscribeRoomResponse,
	RoomSubscriptionPayload,
	GetRoomsResponse,
	RoomData,
} from '../constants/GQL_INTERFACE';

export function useSubscribeRoom(payload) {
	const { data, loading, error } = useSubscription<
		SubscribeRoomResponse,
		RoomSubscriptionPayload
	>(GQL_QUERY.SUBSCRIBE_ROOM_QUERY, {
		variables: payload,
		onSubscriptionData: ({ client, subscriptionData }) => {
			const subscribedRoom = subscriptionData?.data?.subscribeRoom;
			const existingRooms = client.cache.readQuery<GetRoomsResponse>({
				query: GQL_QUERY.GET_ROOMS_QUERY,
				variables: {
					owner_user_id: payload.subscriber_id,
				},
			});

			if (subscribedRoom && existingRooms) {
				let isNewRoom = true;

				const updatedRooms = existingRooms.getRooms.reduce(
					(rooms: RoomData[], room) => {
						if (room._id !== subscribedRoom._id) {
							rooms.push(room);
						} else {
							isNewRoom = false;
							rooms.push(subscribedRoom);
						}
						return rooms;
					},
					[]
				);

				if (isNewRoom) {
					updatedRooms.push(subscribedRoom);
				}

				client.cache.writeQuery({
					query: GQL_QUERY.GET_ROOMS_QUERY,
					variables: {
						owner_user_id: payload.subscriber_id,
					},
					data: {
						getRooms: updatedRooms,
					},
				});
			}
		},
	});
	return { data, loading, error };
}
