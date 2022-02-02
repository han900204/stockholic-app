import React, { useState, useEffect } from 'react';
import Subheading from './styleComponents/Subheading';
import { ForumData } from '../constants/GQL_INTERFACE';
import TextBox from '../components/styleComponents/TextBox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';

const ForumForm = ({ data }) => {
  const [description, setDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const forum: ForumData = data.getForum;

  useEffect(() => {
    setDescription(forum.description);
  }, []);

  return (
    <>
      <Box
        sx={{
          margin: 'auto',
          width: '80%',
        }}
      >
        <Subheading title='HI' />
        <Grid container spacing={2}>
          <Grid item xs={8}>
            Posted By: {forum.nick_name}
          </Grid>
          <Grid item xs={4}>
            <Box display='flex' justifyContent='flex-end'>
              Posted on:{' '}
              {new Date(forum.date_created).toISOString().split('T')[0]}
            </Box>
          </Grid>
        </Grid>
        {!isEdit ? (
          <>
            <TextBox data={forum.description} />
            <Btn
              text='Edit'
              type='button'
              eHandler={() => {
                setIsEdit(true);
              }}
            />
          </>
        ) : (
          <>
            HIHI
            <Btn
              text='Done'
              type='button'
              eHandler={() => {
                setIsEdit(false);
              }}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default ForumForm;
