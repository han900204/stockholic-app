import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
  CreateRoomResponse,
  CreateRoomPayload,
} from '../constants/GQL_INTERFACE';
import TextAreaField from './styleComponents/TextAreaField';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import BasicModal from './styleComponents/BasicModal';
import { useCreateRoom } from '../hooks/useCreateRoom';
import DropdownSelect from '../components/styleComponents/DropdownSelect';

export default function CreateRoomModal({ investorId, nickName }) {
  const [name, setName] = useState('');
  const [subscriber, setSubscriber] = useState(0);

  const createRoomPayload: CreateRoomPayload = {
    owner_user_id: investorId,
    nick_name: nickName,
    name,
    subscribers: [subscriber],
  };

  const { createRoom } = useCreateRoom();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const { data } = await createRoom({
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
          setSubscriber(0);
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
