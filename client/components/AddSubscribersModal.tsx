import React from 'react';
import { AddSubscribersPayload } from '../constants/GQL_INTERFACE';
import TextAreaField from './styleComponents/TextAreaField';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import BasicModal from './styleComponents/BasicModal';
import { useAddSubscribers } from '../hooks/useAddSubscribers';
import { useDispatch } from 'react-redux';
import { setNewSubscribers } from '../features/roomSlice';

export default function AddSubscribersModal({
  roomId,
  newSubscribers,
  investors,
}) {
  /**
   * Add subscribers hook
   */
  const addSubscribersPayload: AddSubscribersPayload = {
    _id: roomId,
    subscribers: newSubscribers,
  };

  const { addSubscribers } = useAddSubscribers();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await addSubscribers({ variables: addSubscribersPayload });
    } catch (e: any) {
      console.log('ERROR: ', e);
    }
  };

  const ModalComponent = (handleClose) => (
    <div>
      <Box
        component='form'
        onSubmit={(e) => {
          handleSubmit(e);
          handleClose();
        }}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '75%' },
        }}
        autoComplete='off'
      >
        <div>Select User</div>
        <br />
        <Btn text='Invite' type='submit' />
      </Box>
    </div>
  );

  return (
    <BasicModal
      buttonName={'Invite'}
      heading={'Invite Investors'}
      Component={ModalComponent}
    />
  );
}
