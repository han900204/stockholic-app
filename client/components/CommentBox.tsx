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
	CreateVotePayload,
	DeleteVotePayload,
	VoteData,
} from '../constants/GQL_INTERFACE';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useCreateVote } from '../hooks/useCreateVote';
import { useDeleteVote } from '../hooks/useDeleteVote';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbDown from '@mui/icons-material/ThumbDown';
import dateFormatter from '../utils/dateFormatter';

const CommentBox = ({
	data,
	investorId,
	vote,
}: {
	data: CommentData;
	investorId: number;
	vote: VoteData | undefined;
}) => {
	const [comment, setComment] = useState('');
	const [isEdit, setIsEdit] = useState(false);
	const { updateComment } = useUpdateComment();
	const { deleteComment } = useDeleteComment();
	const { createVote } = useCreateVote();
	const { deleteVote } = useDeleteVote();

	const handleCreateVote = async (commentPayload, votePayload) => {
		await updateComment({
			variables: commentPayload,
		});
		await createVote({
			variables: votePayload,
		});
	};

	const handleDeleteVote = async (commentPayload, votePayload) => {
		await updateComment({
			variables: commentPayload,
		});
		await deleteVote({
			variables: votePayload,
		});
	};

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
								<Box>
									<ThumbUp
										fontSize='small'
										color={vote?.type === 'likes' ? 'primary' : 'action'}
										onClick={
											!vote
												? (e) => {
														const updateCommentPayload: UpdateCommentPayload = {
															id: data.id,
															likes: Number(data.likes) + 1,
														};

														const createVotePayload: CreateVotePayload = {
															forum_id: data.forum_id,
															comment_id: data.id,
															investor_id: investorId,
															type: 'likes',
														};
														handleCreateVote(
															updateCommentPayload,
															createVotePayload
														);
												  }
												: vote.type === 'likes'
												? (e) => {
														const updateCommentPayload: UpdateCommentPayload = {
															id: data.id,
															likes: Number(data.likes) - 1,
														};

														const deleteVotePayload: DeleteVotePayload = {
															id: vote.id,
														};
														handleDeleteVote(
															updateCommentPayload,
															deleteVotePayload
														);
												  }
												: undefined
										}
									/>
									&nbsp;{data.likes}
								</Box>
								<Box>
									<ThumbDown
										fontSize='small'
										color={vote?.type === 'dislikes' ? 'warning' : 'action'}
										onClick={
											!vote
												? (e) => {
														const updateCommentPayload: UpdateCommentPayload = {
															id: data.id,
															dislikes: Number(data.dislikes) + 1,
														};

														const createVotePayload: CreateVotePayload = {
															forum_id: data.forum_id,
															comment_id: data.id,
															investor_id: investorId,
															type: 'dislikes',
														};
														handleCreateVote(
															updateCommentPayload,
															createVotePayload
														);
												  }
												: vote.type === 'dislikes'
												? (e) => {
														const updateCommentPayload: UpdateCommentPayload = {
															id: data.id,
															dislikes: Number(data.dislikes) - 1,
														};

														const deleteVotePayload: DeleteVotePayload = {
															id: vote.id,
														};
														handleDeleteVote(
															updateCommentPayload,
															deleteVotePayload
														);
												  }
												: undefined
										}
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
