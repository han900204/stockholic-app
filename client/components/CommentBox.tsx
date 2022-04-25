import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Btn from './styleComponents/Btn';
import Grid from '@mui/material/Grid';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	CommentData,
	UpdateCommentPayload,
	DeleteCommentPayload,
	GetVotesResponse,
	GetVotesPayload,
	CreateVotePayload,
	CreateVoteResponse,
	DeleteVotePayload,
	DeleteVoteResponse,
	VoteData,
} from '../constants/GQL_INTERFACE';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useCreateVote } from '../hooks/useCreateVote';
import { useDeleteVote } from '../hooks/useDeleteVote';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbDown from '@mui/icons-material/ThumbDown';
import dateFormatter from '../utils/dateFormatter';
import TextEditor from './styleComponents/TextEditor';
import LoadingForm from '../components/LoadingForm';

const CommentBox = ({
	commentData,
	investorId,
}: {
	commentData: CommentData;
	investorId: number;
}) => {
	const [comment, setComment] = useState('');
	const [isEdit, setIsEdit] = useState(false);
	const { updateComment } = useUpdateComment();
	const { deleteComment } = useDeleteComment();
	const { loading, error, data } = useQuery<GetVotesResponse, GetVotesPayload>(
		GQL_QUERY.GET_VOTES_QUERY,
		{
			variables: { comment_id: commentData.id, investor_id: investorId },
			fetchPolicy: 'cache-and-network',
		}
	);
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

	let vote: VoteData | null = null;

	if (data) vote = data.getVotes[0];

	if (loading) return <LoadingForm />;

	return (
		<>
			<Box sx={{ mt: 5 }}>
				{!isEdit ? (
					<TextEditor
						height={200}
						state={commentData.description}
						setState={setComment}
						permission={isEdit}
					/>
				) : (
					<TextEditor
						height={200}
						state={comment}
						setState={setComment}
						permission={isEdit}
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
								<Box>Posted By: {commentData.nick_name}</Box>
								<Box>Posted on: {dateFormatter(commentData.date_created)}</Box>
								<Box>
									<ThumbUp
										fontSize='small'
										color={vote?.type === 'likes' ? 'primary' : 'action'}
										onClick={
											!vote
												? (e) => {
														const updateCommentPayload: UpdateCommentPayload = {
															id: commentData.id,
															likes: Number(commentData.likes) + 1,
														};

														const createVotePayload: CreateVotePayload = {
															forum_id: commentData.forum_id,
															comment_id: commentData.id,
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
															id: commentData.id,
															likes: Number(commentData.likes) - 1,
														};
														let id: any = null;
														if (vote?.id) {
															id = vote.id;
														}
														const deleteVotePayload: DeleteVotePayload = {
															id,
														};
														handleDeleteVote(
															updateCommentPayload,
															deleteVotePayload
														);
												  }
												: undefined
										}
									/>
									&nbsp;{commentData.likes}
								</Box>
								<Box>
									<ThumbDown
										fontSize='small'
										color={vote?.type === 'dislikes' ? 'warning' : 'action'}
										onClick={
											!vote
												? (e) => {
														const updateCommentPayload: UpdateCommentPayload = {
															id: commentData.id,
															dislikes: Number(commentData.dislikes) + 1,
														};

														const createVotePayload: CreateVotePayload = {
															forum_id: commentData.forum_id,
															comment_id: commentData.id,
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
															id: commentData.id,
															dislikes: Number(commentData.dislikes) - 1,
														};
														let id: any = null;
														if (vote?.id) {
															id = vote.id;
														}
														const deleteVotePayload: DeleteVotePayload = {
															id,
														};
														handleDeleteVote(
															updateCommentPayload,
															deleteVotePayload
														);
												  }
												: undefined
										}
									/>
									&nbsp;{commentData.dislikes}
								</Box>
							</Stack>
						</Box>
					</Grid>
					<Grid item xs={6}>
						{commentData.owner_user_id === investorId ? (
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
											setComment(commentData.description);
											setIsEdit(true);
										}}
									/>
								) : (
									<Btn
										text='Done'
										type='button'
										eHandler={async () => {
											const updateCommentPayload: UpdateCommentPayload = {
												id: commentData.id,
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
											id: commentData.id,
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
