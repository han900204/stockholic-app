import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Subheading from './styleComponents/Subheading';
import TextAreaField from './styleComponents/TextAreaField';
import { RootState } from '../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { setNewMessage } from '../features/messageSlice';
import { useQuery, useSubscription } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  GetMessagesResponse,
  GetMessagesPayload,
  CreateMessagePayload,
  SubscribeMessageResponse,
  SubscribeMessagePayload,
} from '../constants/GQL_INTERFACE';
import { useCreateMessage } from '../hooks/useCreateMessage';
import Btn from './styleComponents/Btn';
import TextField from '@mui/material/TextField';

const ChatRoom = ({
  roomId,
  investorId,
  nickName,
}: {
  roomId: string | '';
  investorId: number | null;
  nickName: string | null;
}) => {
  const dispatch = useDispatch();
  const newMessage: string = useSelector(
    (state: RootState) => state.message.newMessage
  );
  const { loading, error, data } = useQuery<
    GetMessagesResponse,
    GetMessagesPayload
  >(GQL_QUERY.GET_MESSAGES_QUERY, { variables: { _room: roomId } });

  const CreateMessagePayload: CreateMessagePayload = {
    _room: roomId,
    sender_id: investorId,
    nick_name: nickName,
    message: newMessage,
  };

  const subs = useSubscription<
    SubscribeMessageResponse,
    SubscribeMessagePayload
  >(GQL_QUERY.SUBSCRIBE_MESSAGE, {
    variables: { _room: roomId, sender_id: investorId },
  });

  console.log('In app subscription: ', subs.data);

  const { createMessage } = useCreateMessage();

  const handleClick = async (e: any) => {
    e.preventDefault();

    try {
      await createMessage({ variables: CreateMessagePayload });
    } catch (e: any) {
      console.log('ERROR: ', e);
    }
  };

  return (
    <Box
      sx={{
        height: '80vh',
      }}
    >
      {!roomId ? (
        <Subheading title='Please select the Chat room!' />
      ) : (
        <>
          <Box
            sx={{
              height: '80%',
              overflow: 'scroll',
            }}
          >
            <List>
              {data?.getMessages.map((message, index) => {
                return investorId === message.sender_id ? (
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
            </List>
          </Box>
          <Box
            sx={{
              height: '20%',
              overflow: 'scroll',
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
              rows={5}
              fullWidth
              type='text'
              value={newMessage}
              onKeyPress={(e: any) => {
                if (!e.shiftKey && e.key === 'Enter') {
                  e.preventDefault();
                  handleClick(e);
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
            <Btn
              text='Post'
              type='button'
              eHandler={(e) => {
                handleClick(e);
                dispatch(setNewMessage(' '));
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatRoom;
