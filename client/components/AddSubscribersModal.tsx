import React from 'react';
import { AddSubscribersPayload } from '../constants/GQL_INTERFACE';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import BasicModal from './styleComponents/BasicModal';
import { useAddSubscribers } from '../hooks/useAddSubscribers';
import { useDispatch } from 'react-redux';
import { setNewSubscribers } from '../features/roomSlice';
import MultiSelect from './styleComponents/MultiSelect';

export default function AddSubscribersModal({
  roomId,
  newSubscribers,
  investors,
}) {
  const dispatch = useDispatch();

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
      dispatch(setNewSubscribers([]));
    } catch (e: any) {
      console.log('ERROR: ', e);
    }
  };

  /**
   *
   * Convert keys for multi-select dropdown
   */

  const copyInvestors = JSON.parse(JSON.stringify(investors));

  for (let investor of copyInvestors) {
    investor['value'] = investor['id'];
    investor['label'] = investor['nick_name'];
    delete investor['id'];
    delete investor['nick_name'];
  }

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
        <MultiSelect
          items={copyInvestors}
          dispatch={(ids) => {
            dispatch(setNewSubscribers(ids));
          }}
          state={newSubscribers}
        />
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
      isMenu={true}
    />
  );
}
