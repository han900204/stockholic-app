import React, { useState } from 'react';
import Subheading from './styleComponents/Subheading';
import Box from '@mui/material/Box';
import TextAreaField from './styleComponents/TextAreaField';
import Stack from '@mui/material/Stack';
import Btn from './styleComponents/Btn';
import { CreateCommentPayload } from '../constants/GQL_INTERFACE';
import { useCreateComment } from '../hooks/useCreateComment';
import CommentBox from './CommentBox';

const CommentForm = ({ data, investorId, forumId }) => {
  const [comment, setComment] = useState('');
  const { createComment } = useCreateComment();

  const createCommentPayload: CreateCommentPayload = {
    owner_user_id: investorId,
    description: comment,
    forum_id: forumId,
  };

  return (
    <>
      <Box
        sx={{
          margin: 'auto',
          width: '80%',
        }}
      >
        <Subheading title='Comments' />

        <TextAreaField
          label='Add Comments'
          type='text'
          required={true}
          eHandler={(e) => {
            setComment(e.target.value);
          }}
          rows={5}
          value={comment}
        />
        <Stack
          direction='row'
          spacing={2}
          justifyContent='right'
          alignItems='right'
        >
          <Btn
            text='Post Comment'
            type='button'
            eHandler={async () => {
              await createComment({ variables: createCommentPayload });
              setComment(' ');
            }}
          />
        </Stack>
        {data?.getComments.map((comment, idx) => {
          return (
            <CommentBox key={idx} data={comment} investorId={investorId} />
          );
        })}
      </Box>
    </>
  );
};

export default CommentForm;
