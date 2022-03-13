import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextAreaField from './styleComponents/TextAreaField';
import Stack from '@mui/material/Stack';
import Btn from './styleComponents/Btn';
import TextBox from './styleComponents/TextBox';
import Grid from '@mui/material/Grid';
import {
	CommentData,
	UpdateCommentPayload,
	DeleteCommentPayload,
} from '../constants/GQL_INTERFACE';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useDeleteComment } from '../hooks/useDeleteComment';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbDown from '@mui/icons-material/ThumbDown';
import dateFormatter from '../utils/dateFormatter';

const CommentBox = ({
	data,
	investorId,
}: {
	data: CommentData;
	investorId: number;
}) => {
	const [comment, setComment] = useState('');
	const [isEdit, setIsEdit] = useState(false);
	const { updateComment } = useUpdateComment();
	const { deleteComment } = useDeleteComment();

	return (
		<>
			<Box sx={{ mt: 5 }}>
				{!isEdit ? (
					<TextBox data={data.description} height={150} />
				) : (
					<TextAreaField
						label='Comment'
						type='text'
						required={true}
						eHandler={(e) => {
							setComment(e.target.value);
						}}
						rows={7}
						defaultValue={data.description}
					/>
				)}

				<Grid container spacing={2} sx={{ mb: 2 }}>
					<Grid item xs={6}>
						<Box sx={{ mb: 1 }}>
							<Stack
								direction='row'
								spacing={2}
								justifyContent='left'
								alignItems='left'
							>
								<Box>Posted By: {data.nick_name}</Box>
								<Box>Posted on: {dateFormatter(data.date_created)}</Box>
								{/* TODO: Add likes / dislikes icon and submit request to
								increment in event of click */}
								<Box>
									<ThumbUp
										fontSize='small'
										onClick={async () => {
											const updateCommentPayload: UpdateCommentPayload = {
												id: data.id,
												likes: Number(data.likes) + 1,
											};
											await updateComment({ variables: updateCommentPayload });
										}}
									/>
									&nbsp;{data.likes}
								</Box>
								<Box>
									<ThumbDown
										fontSize='small'
										onClick={async () => {
											const updateCommentPayload: UpdateCommentPayload = {
												id: data.id,
												dislikes: Number(data.dislikes) + 1,
											};
											await updateComment({ variables: updateCommentPayload });
										}}
									/>
									&nbsp;{data.dislikes}
								</Box>
							</Stack>
						</Box>
					</Grid>
					<Grid item xs={6}>
						{data.owner_user_id === investorId ? (
							<Stack
								direction='row'
								spacing={2}
								justifyContent='right'
								alignItems='right'
							>
								{!isEdit ? (
									<Btn
										text='Edit'
										type='button'
										eHandler={() => {
											setComment(data.description);
											setIsEdit(true);
										}}
									/>
								) : (
									<Btn
										text='Done'
										type='button'
										eHandler={async () => {
											const updateCommentPayload: UpdateCommentPayload = {
												id: data.id,
												description: comment,
											};
											await updateComment({ variables: updateCommentPayload });
											setIsEdit(false);
										}}
									/>
								)}
								<Btn
									text='Delete'
									type='button'
									eHandler={() => {
										const deleteCommentPayload: DeleteCommentPayload = {
											id: data.id,
										};
										deleteComment({ variables: deleteCommentPayload });
									}}
								/>
							</Stack>
						) : (
							<></>
						)}
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default CommentBox;
