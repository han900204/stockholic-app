import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import { CreateForumPayload } from '../constants/GQL_INTERFACE';
import TextArea from './styleComponents/TextArea';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import BasicModal from './styleComponents/BasicModal';

export default function CreateForumModal({ investorId }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const forumPayload: CreateForumPayload = {
    owner_user_id: investorId,
    name,
    description,
  };

  const [createForum] = useMutation(GQL_QUERY.CREATE_FORUM_QUERY);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createForum({ variables: forumPayload });
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
          setDescription('');
          handleClose();
        }}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '75%' },
        }}
        autoComplete='off'
      >
        <div>
          <TextArea
            eHandler={(e) => {
              setName(e.target.value);
            }}
            type='text'
            label='Topic'
            required={true}
          />
        </div>
        <div>
          <TextArea
            eHandler={(e) => {
              setDescription(e.target.value);
            }}
            type='text'
            label='Description'
            required={false}
          />
        </div>
        <br />
        <Btn text='Create' type='submit' />
      </Box>
    </div>
  );

  return (
    <BasicModal
      buttonName={'Create Forum'}
      heading={'Create a New Forum'}
      Component={ModalComponent}
    />
  );
}
