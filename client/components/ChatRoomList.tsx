import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useDispatch } from 'react-redux';
import { setNewMessage } from '../features/messageSlice';

const ChatRoomList = ({ rooms, setCurrentRoom }) => {
  const dispatch = useDispatch();
  return (
    <Box
      sx={{
        height: '80vh',
        overflow: 'scroll',
      }}
    >
      <List>
        {rooms.map((room, index) => (
          <ListItem
            button
            key={index}
            onClick={() => {
              setCurrentRoom(room._id);
              dispatch(setNewMessage(' '));
            }}
          >
            <ListItemText primary={`${room.name}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatRoomList;
