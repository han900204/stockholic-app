import React from 'react';
import Subheading from './styleComponents/Subheading';
import Box from '@mui/material/Box';
import TextAreaField from './styleComponents/TextAreaField';

const CommentForm = () => {
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
            console.log('add!');
          }}
          rows={8}
        />
      </Box>
    </>
  );
};

export default CommentForm;
