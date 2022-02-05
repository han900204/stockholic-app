import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const ChatRoomList = ({ rooms, setCurrentRoom }) => {
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
