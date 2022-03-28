import React from 'react';
import Subheading from '../components/styleComponents/Subheading';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	GetRoomsResponse,
	GetRoomsPayload,
	InvestorData,
	RoomSubscriptionPayload,
	RoomData,
} from '../constants/GQL_INTERFACE';
import Box from '@mui/material/Box';
import ChatRoomList from '../components/ChatRoomList';
import Grid from '@mui/material/Grid';
import LoadingForm from '../components/LoadingForm';
import ChatRoom from '../components/ChatRoom';
import CreateRoomModal from '../components/CreateRoomModal';
import { useSubscribeRoom } from '../hooks/useSubscribeRoom';
import { useUnsubscribeRoom } from '../hooks/useUnsubscribeRoom';

const ChatContainer = () => {
	const {
		investorId,
		nickName,
		investors,
	}: {
		investorId: number | null;
		nickName: string | null;
		investors: InvestorData[];
	} = useSelector((state: RootState) => state.investor);

	const {
		newMessage,
		newSubscribers,
		currentRoomId,
	}: {
		newMessage: string;
		newSubscribers: number[];
		currentRoomId: string | '';
	} = useSelector((state: RootState) => state.room);

	const { loading, error, data } = useQuery<GetRoomsResponse, GetRoomsPayload>(
		GQL_QUERY.GET_ROOMS_QUERY,
		{ variables: { owner_user_id: investorId } }
	);

	/**
	 * Subscribe room for real time updates
	 */

	const roomSubscriptionPayload: RoomSubscriptionPayload = {
		subscriber_id: investorId,
	};

	useSubscribeRoom(roomSubscriptionPayload);
	useUnsubscribeRoom(roomSubscriptionPayload);

	/**
	 * Current Room to render
	 */

	const currentRoom: RoomData | undefined = data?.getRooms.find(
		(room) => room._id === currentRoomId
	);

	if (loading) return <LoadingForm />;

	return (
		<Box
			sx={{
				margin: 'auto',
				width: '80%',
			}}
		>
			<CreateRoomModal investorId={investorId} nickName={nickName} />
			<Grid container spacing={2} sx={{ mb: 1 }}>
				<Grid item xs={4}>
					<ChatRoomList rooms={data?.getRooms} />
				</Grid>
				<Grid item xs={8}>
					{!currentRoom ? (
						<Subheading title='Please select the room' />
					) : (
						<ChatRoom
							investorId={investorId}
							nickName={nickName}
							newMessage={newMessage}
							newSubscribers={newSubscribers}
							investors={investors}
							room={currentRoom}
						/>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default ChatContainer;
