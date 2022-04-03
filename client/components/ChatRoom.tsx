import React, { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Subheading from './styleComponents/Subheading';
import Btn from './styleComponents/Btn';
import TextField from '@mui/material/TextField';
import AddSubscribersModal from './AddSubscribersModal';
import OptionMenu from './styleComponents/OptionMenu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { setNewMessage, setCurrentRoomId } from '../features/roomSlice';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	GetMessagesResponse,
	GetMessagesPayload,
	CreateMessagePayload,
	SubscribeMessagePayload,
	InvestorData,
	DeleteRoomPayload,
	RemoveSubscriberPayload,
	RoomData,
} from '../constants/GQL_INTERFACE';
import { useCreateMessage } from '../hooks/useCreateMessage';
import { useSubscribeMessage } from '../hooks/useSubscribeMessage';
import { useDeleteRoom } from '../hooks/useDeleteRoom';
import { useRemoveSubscriber } from '../hooks/useRemoveSubscriber';

const ChatRoom = ({
	investorId,
	nickName,
	newMessage,
	newSubscribers,
	investors,
	room,
}: {
	investorId: number | null;
	nickName: string | null;
	newMessage: string;
	newSubscribers: number[];
	investors: InvestorData[];
	room: RoomData;
}) => {
	const dispatch = useDispatch();

	const { loading, error, data } = useQuery<
		GetMessagesResponse,
		GetMessagesPayload
	>(GQL_QUERY.GET_MESSAGES_QUERY, {
		variables: { _room: room._id },
		fetchPolicy: 'cache-and-network',
	});

	/**
	 * Scroll to bottm when new message posted
	 */
	const messagesEndRef = useRef<null | HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef?.current?.scrollIntoView({ behavior: 'auto' });
	};

	useEffect(scrollToBottom, [data]);

	/**
	 * Create message hook
	 */

	const createMessagePayload: CreateMessagePayload = {
		_room: room._id,
		sender_id: investorId,
		nick_name: nickName,
		message: newMessage,
	};

	const { createMessage } = useCreateMessage();

	const handlePost = async (e: any) => {
		e.preventDefault();

		try {
			await createMessage({ variables: createMessagePayload });
		} catch (e: any) {
			console.log('ERROR: ', e);
		}
	};

	/**
	 * Delete room hook
	 */
	const deleteRoomPayload: DeleteRoomPayload = {
		_id: room._id,
	};

	const { deleteRoom } = useDeleteRoom();

	/**
	 * Remove subscriber hook
	 */
	const removeSubscriberPayload: RemoveSubscriberPayload = {
		_id: room._id,
		subscriber: investorId,
	};

	const { removeSubscriber } = useRemoveSubscriber();

	/**
	 * Subscribe message for real time updates
	 */

	const subscribeMessagePayload: SubscribeMessagePayload = {
		_room: room._id,
		sender_id: investorId,
	};

	useSubscribeMessage(subscribeMessagePayload);

	/**
	 * Get subscriber nicknames
	 */
	const subscriberNicknames = room?.subscribers.reduce(
		(acc: string[], subscriberId: number) => {
			const investor: InvestorData | undefined = investors.find(
				(investor) => investor.id === subscriberId
			);
			return investor ? [...acc, investor.nick_name] : acc;
		},
		[]
	);

	return (
		<Box
			sx={{
				height: '80vh',
			}}
		>
			<>
				<Box
					sx={{
						height: '20%',
						mb: 4,
						overflow: 'scroll',
					}}
				>
					<Subheading title={room?.name} />
					<Typography>Owner: {room?.nick_name}</Typography>
					Participants:{' '}
					{subscriberNicknames?.map((nickname, idx) =>
						idx === subscriberNicknames.length - 1 ? (
							<span key={idx}>{nickname}</span>
						) : (
							<span key={idx}>{nickname},&nbsp;</span>
						)
					)}
				</Box>
				<Box
					sx={{
						height: '60%',
						overflow: 'scroll',
						mb: 2,
					}}
				>
					<List>
						{data?.getMessages.map((message, index) => {
							return message.sender_id === 0 ? (
								// System messages
								<ListItem key={index}>
									<ListItemText
										primaryTypographyProps={{
											style: {
												whiteSpace: 'normal',
												fontStyle: 'italic',
												color: '#808080',
											},
										}}
										primary={
											<>
												<div>{message.message}</div>
											</>
										}
									/>
								</ListItem>
							) : investorId === message.sender_id ? (
								<ListItem key={index} style={{ textAlign: 'right' }}>
									<ListItemText
										primaryTypographyProps={{
											style: { whiteSpace: 'normal' },
										}}
										primary={
											<>
												<div>{message.nick_name}:</div>
												<div>{message.message}</div>
											</>
										}
									/>
								</ListItem>
							) : (
								<ListItem key={index}>
									<ListItemText
										primaryTypographyProps={{
											style: { whiteSpace: 'normal' },
										}}
										primary={
											<>
												<div>{message.nick_name}:</div>
												<div>{message.message}</div>
											</>
										}
									/>
								</ListItem>
							);
						})}
						<div ref={messagesEndRef} />
					</List>
				</Box>
				<Box
					sx={{
						height: '20%',
					}}
				>
					<TextField
						onChange={(e) => {
							dispatch(setNewMessage(e.target.value));
						}}
						required={true}
						variant='outlined'
						label='Type...'
						multiline
						rows={3}
						fullWidth
						type='text'
						value={newMessage}
						onKeyPress={(e: any) => {
							if (!e.shiftKey && e.key === 'Enter') {
								e.preventDefault();
								handlePost(e);
								dispatch(setNewMessage(' '));
							}
						}}
						onKeyDown={(e) => {
							if (e.shiftKey && e.key === 'Enter') {
								e.preventDefault();
								dispatch(setNewMessage(`${newMessage}` + '\n'));
							}
						}}
					/>
					<Grid container spacing={2} sx={{ mb: 1 }}>
						<Grid item xs={6}>
							<Btn
								text='Post'
								type='button'
								eHandler={(e) => {
									handlePost(e);
									dispatch(setNewMessage(' '));
								}}
							/>
						</Grid>
						<Grid item xs={6}>
							<Box display='flex' justifyContent='flex-end'>
								<OptionMenu
									ItemsComponent={
										<div>
											<AddSubscribersModal
												roomId={room._id}
												newSubscribers={newSubscribers}
												investors={investors}
												inviter={nickName}
												currentSubscribers={room.subscribers}
											/>
											{investorId === room.owner_user_id ? (
												<MenuItem
													onClick={async () => {
														await deleteRoom({
															variables: deleteRoomPayload,
														});
														dispatch(setCurrentRoomId(''));
													}}
												>
													<Typography textAlign='center'>Delete</Typography>
												</MenuItem>
											) : (
												<MenuItem
													onClick={async () => {
														await removeSubscriber({
															variables: removeSubscriberPayload,
														});
														dispatch(setCurrentRoomId(''));
													}}
												>
													<Typography textAlign='center'>Leave</Typography>
												</MenuItem>
											)}
										</div>
									}
								/>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</>
		</Box>
	);
};

export default ChatRoom;
