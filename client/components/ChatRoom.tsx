import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Subheading from './styleComponents/Subheading';
import TextAreaField from './styleComponents/TextAreaField';
import { RootState } from '../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { setNewMessage } from '../features/messageSlice';

const ChatRoom = ({
  messages,
  investorId,
}: {
  messages: any[] | null;
  investorId: number | null;
}) => {
  const dispatch = useDispatch();
  const newMessage: string = useSelector(
    (state: RootState) => state.message.newMessage
  );

  return (
    <Box
      sx={{
        height: '80vh',
      }}
    >
      {!messages ? (
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
              {messages.map((message, index) => {
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
            <TextAreaField
              label='Type...'
              type='text'
              required={true}
              eHandler={(e) => {
                dispatch(setNewMessage(e.target.value));
              }}
              rows={5}
              value={newMessage}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatRoom;
