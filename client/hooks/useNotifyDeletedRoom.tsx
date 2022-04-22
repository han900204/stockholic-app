import React from 'react';
import { useSubscription } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	NotifyDeletedRoomResponse,
	RoomSubscriptionPayload,
	GetRoomsResponse,
	RoomData,
} from '../constants/GQL_INTERFACE';

export function useNotifyDeletedRoom(payload) {
	const { data, loading, error } = useSubscription<
		NotifyDeletedRoomResponse,
		RoomSubscriptionPayload
	>(GQL_QUERY.NOTIFY_DELETED_ROOM_QUERY, {
		variables: payload,
		onSubscriptionData: ({ client, subscriptionData }) => {
			const deletedRoom = subscriptionData?.data?.notifyDeletedRoom;
			const existingRooms = client.cache.readQuery<GetRoomsResponse>({
				query: GQL_QUERY.GET_ROOMS_QUERY,
				variables: {
					owner_user_id: payload.subscriber_id,
				},
			});
			console.log('subs Check', subscriptionData);
			if (deletedRoom && existingRooms) {
				client.cache.writeQuery({
					query: GQL_QUERY.GET_ROOMS_QUERY,
					variables: {
						owner_user_id: payload.subscriber_id,
					},
					data: {
						getRooms: existingRooms.getRooms.reduce(
							(rooms: RoomData[], room: RoomData) => {
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
	return { data, loading, error };
}
