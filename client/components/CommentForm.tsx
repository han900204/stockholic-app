import React, { useState } from 'react';
import Subheading from './styleComponents/Subheading';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Btn from './styleComponents/Btn';
import { CreateCommentPayload } from '../constants/GQL_INTERFACE';
import GQL_QUERY from '../constants/GQL_QUERY';
import { useCreateComment } from '../hooks/useCreateComment';
import CommentBox from './CommentBox';
import TextEditor from './styleComponents/TextEditor';

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

				<TextEditor
					height={300}
					state={comment}
					setState={setComment}
					permission={true}
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
				{data?.getComments.map((comment, idx) => (
					<CommentBox key={idx} commentData={comment} investorId={investorId} />
				))}
			</Box>
		</>
	);
};

export default CommentForm;
