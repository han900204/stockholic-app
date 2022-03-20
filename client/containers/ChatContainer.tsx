import React from 'react';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	GetRoomsResponse,
	GetRoomsPayload,
	InvestorData,
	RoomSubscriptionPayload,
} from '../constants/GQL_INTERFACE';
import Subheading from '../components/styleComponents/Subheading';
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
		currentRoom,
		currentRoomOwnerId,
	}: {
		newMessage: string;
		newSubscribers: number[];
		currentRoom: string | '';
		currentRoomOwnerId: number | null;
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

	if (loading) return <LoadingForm />;

	return (
		<Box
			sx={{
				margin: 'auto',
				width: '80%',
			}}
		>
			<Subheading title={`${nickName}'s chat rooms`} />
			<CreateRoomModal investorId={investorId} nickName={nickName} />
			<Grid container spacing={2} sx={{ mb: 1 }}>
				<Grid item xs={4}>
					<ChatRoomList rooms={data?.getRooms} />
				</Grid>
				<Grid item xs={8}>
					<ChatRoom
						roomId={currentRoom}
						investorId={investorId}
						nickName={nickName}
						newMessage={newMessage}
						newSubscribers={newSubscribers}
						investors={investors}
						currentRoomOwnerId={currentRoomOwnerId}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ChatContainer;
