import React, { useState, useEffect } from 'react';
import Subheading from './styleComponents/Subheading';
import TextBox from '../components/styleComponents/TextBox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import TextAreaField from './styleComponents/TextAreaField';
import { useUpdateForum } from '../hooks/useUpdateForum';
import {
  ForumData,
  UpdateForumPayload,
  DeleteForumPayload,
} from '../constants/GQL_INTERFACE';
import { useDeleteForum } from '../hooks/useDeleteForum';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';

const ForumForm = ({ data, investorId }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [desc, setDesc] = useState('');
  const navigate = useNavigate();

  const forum: ForumData = data.getForum;

  const { updateForum } = useUpdateForum();

  const { deleteForum } = useDeleteForum();

  const updateForumPayload: UpdateForumPayload = {
    id: forum.id,
    description: desc,
  };

  const deleteForumPayload: DeleteForumPayload = {
    id: forum.id,
  };

  const handleClick = async (e: any) => {
    e.preventDefault();

    try {
      await updateForum({ variables: updateForumPayload });
    } catch (e: any) {
      console.log('ERROR: ', e);
    }
  };

  return (
    <>
      <Box
        sx={{
          margin: 'auto',
          width: '80%',
        }}
      >
        <Subheading title={forum.name} />
        <Grid container spacing={2} sx={{ mb: 1 }}>
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
            {investorId === forum.owner_user_id ? (
              <>
                <Stack
                  direction='row'
                  spacing={2}
                  justifyContent='right'
                  alignItems='right'
                >
                  <Btn
                    text='Edit'
                    type='button'
                    eHandler={() => {
                      setDesc(forum.description);
                      setIsEdit(true);
                    }}
                  />
                  <Btn
                    text='Delete'
                    type='button'
                    eHandler={async (e) => {
                      await deleteForum({ variables: deleteForumPayload });
                      navigate('/forum');
                    }}
                  />
                </Stack>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <TextAreaField
              label='Description'
              type='text'
              required={true}
              eHandler={(e) => {
                setDesc(e.target.value);
              }}
              defaultValue={forum.description}
              rows={15}
            />
            <Btn
              text='Done'
              type='button'
              eHandler={(e) => {
                handleClick(e);
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
