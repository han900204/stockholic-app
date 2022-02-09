import React from 'react';
import { useState } from 'react';
import { CreateRoomPayload } from '../constants/GQL_INTERFACE';
import TextAreaField from './styleComponents/TextAreaField';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import BasicModal from './styleComponents/BasicModal';
import { useCreateRoom } from '../hooks/useCreateRoom';

export default function CreateRoomModal({ investorId, nickName }) {
  const [name, setName] = useState('');

  const createRoomPayload: CreateRoomPayload = {
    owner_user_id: investorId,
    nick_name: nickName,
    name,
  };

  const { createRoom } = useCreateRoom();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createRoom({
        variables: createRoomPayload,
      });
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
          setName('');
          handleClose();
        }}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '75%' },
        }}
        autoComplete='off'
      >
        <div>
          <TextAreaField
            eHandler={(e) => {
              setName(e.target.value);
            }}
            type='text'
            label='Room Name'
            required={true}
            rows={1}
          />
        </div>
        <br />
        <Btn text='Create' type='submit' />
      </Box>
    </div>
  );

  return (
    <BasicModal
      buttonName={'Create Room'}
      heading={'Create a New Room'}
      Component={ModalComponent}
    />
  );
}
