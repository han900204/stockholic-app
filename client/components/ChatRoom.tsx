import React, { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Subheading from './styleComponents/Subheading';
import Btn from './styleComponents/Btn';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import { setNewMessage } from '../features/roomSlice';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  GetMessagesResponse,
  GetMessagesPayload,
  CreateMessagePayload,
  SubscribeMessagePayload,
  InvestorData,
} from '../constants/GQL_INTERFACE';
import { useCreateMessage } from '../hooks/useCreateMessage';
import { useSubscribeMessage } from '../hooks/useSubscribeMessage';
import AddSubscribersModal from './AddSubscribersModal';

const ChatRoom = ({
  roomId,
  investorId,
  nickName,
  newMessage,
  newSubscribers,
  investors,
}: {
  roomId: string | '';
  investorId: number | null;
  nickName: string | null;
  newMessage: string;
  newSubscribers: number[];
  investors: InvestorData[];
}) => {
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery<
    GetMessagesResponse,
    GetMessagesPayload
  >(GQL_QUERY.GET_MESSAGES_QUERY, {
    variables: { _room: roomId },
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
    _room: roomId,
    sender_id: investorId,
    nick_name: nickName,
    message: newMessage,
  };

  const { createMessage } = useCreateMessage();

  const handleClick = async (e: any) => {
    e.preventDefault();

    try {
      await createMessage({ variables: createMessagePayload });
    } catch (e: any) {
      console.log('ERROR: ', e);
    }
  };

  /**
   * Subscribe message for real time updates
   */

  const subscribeMessagePayload: SubscribeMessagePayload = {
    _room: roomId,
    sender_id: investorId,
  };

  useSubscribeMessage(subscribeMessagePayload);

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
              <div ref={messagesEndRef} />
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
              rows={3}
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
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={6}>
                <Btn
                  text='Post'
                  type='button'
                  eHandler={(e) => {
                    handleClick(e);
                    dispatch(setNewMessage(' '));
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Box display='flex' justifyContent='flex-end'>
                  <AddSubscribersModal
                    roomId={roomId}
                    newSubscribers={newSubscribers}
                    investors={investors}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatRoom;
