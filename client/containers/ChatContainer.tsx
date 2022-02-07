import React, { useState } from 'react';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import { GetRoomsResponse, GetRoomsPayload } from '../constants/GQL_INTERFACE';
import Subheading from '../components/styleComponents/Subheading';
import Box from '@mui/material/Box';
import ChatRoomList from '../components/ChatRoomList';
import Grid from '@mui/material/Grid';
import LoadingForm from '../components/LoadingForm';
import ChatRoom from '../components/ChatRoom';
import CreateRoomModal from '../components/CreateRoomModal';

const ChatContainer = () => {
  const [currentRoom, setCurrentRoom] = useState('');

  const investorId: number | null = useSelector(
    (state: RootState) => state.investor.investorId
  );
  const nickName: string | null = useSelector(
    (state: RootState) => state.investor.nickName
  );

  const { loading, error, data } = useQuery<GetRoomsResponse, GetRoomsPayload>(
    GQL_QUERY.GET_ROOMS_QUERY,
    { variables: { owner_user_id: investorId } }
  );

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
          <ChatRoomList
            rooms={data?.getRooms}
            setCurrentRoom={setCurrentRoom}
          />
        </Grid>
        <Grid item xs={8}>
          <ChatRoom
            roomId={currentRoom}
            investorId={investorId}
            nickName={nickName}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatContainer;
