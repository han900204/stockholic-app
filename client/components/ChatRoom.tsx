import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Subheading from './styleComponents/Subheading';

const ChatRoom = ({
  messages,
  investorId,
}: {
  messages: any[] | null;
  investorId: number | null;
}) => {
  return (
    <Box
      sx={{
        height: '80vh',
        overflow: 'scroll',
      }}
    >
      {!messages ? (
        <Subheading title='Please select the Chat room!' />
      ) : (
        <List>
          {messages.map((message, index) => {
            return investorId === message.sender_id ? (
              <ListItem key={index} style={{ textAlign: 'right' }}>
                <ListItemText
                  primaryTypographyProps={{ style: { whiteSpace: 'normal' } }}
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
                  primaryTypographyProps={{ style: { whiteSpace: 'normal' } }}
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
      )}
    </Box>
  );
};

export default ChatRoom;
