import React, { useState, useEffect } from 'react';
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
	CreateVotePayload,
	CreateVoteResponse,
	DeleteVotePayload,
	DeleteVoteResponse,
	VoteData,
} from '../constants/GQL_INTERFACE';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useDeleteComment } from '../hooks/useDeleteComment';
// import { useCreateVote } from '../hooks/useCreateVote';
// import { useDeleteVote } from '../hooks/useDeleteVote';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbDown from '@mui/icons-material/ThumbDown';
import dateFormatter from '../utils/dateFormatter';
import TextEditor from './styleComponents/TextEditor';
import { isNullableType } from 'graphql';

const CommentBox = ({
	data,
	investorId,
}: // vote,
{
	data: CommentData;
	investorId: number;
	// vote: VoteData | undefined;
}) => {
	const [comment, setComment] = useState('');
	const [isEdit, setIsEdit] = useState(false);
	const { updateComment } = useUpdateComment();
	const { deleteComment } = useDeleteComment();
	const [currentVote, setCurrentVote] = useState<{
		id: number | null;
		type: string | null;
	}>({
		id: null,
		type: null,
	});
	let vote = undefined;
	// useEffect(() => {
	// 	if (vote) {
	// 		setCurrentVote({ ...currentVote, id: vote.id, type: vote.type });
	// 	}
	// }, []);
	// const { createVote } = useCreateVote();
	// const { deleteVote } = useDeleteVote();

	const [createVote] = useMutation<CreateVoteResponse, CreateVotePayload>(
		GQL_QUERY.CREATE_VOTE_QUERY
	);
	const [deleteVote] = useMutation<DeleteVoteResponse, DeleteVotePayload>(
		GQL_QUERY.DELETE_VOTE_QUERY
	);
	const handleCreateVote = async (commentPayload, votePayload) => {
		await updateComment({
			variables: commentPayload,
		});
		const newVote = await createVote({
			variables: votePayload,
		});
		if (newVote?.data?.createVote) {
			setCurrentVote({
				...currentVote,
				id: newVote.data.createVote.id,
				type: newVote.data.createVote.type,
			});
		}
	};

	const handleDeleteVote = async (commentPayload, votePayload) => {
		await updateComment({
			variables: commentPayload,
		});
		const deletedVote = await deleteVote({
			variables: votePayload,
		});
		if (deletedVote?.data?.deleteVote) {
			setCurrentVote({
				...currentVote,
				id: null,
				type: null,
			});
		}
	};

	return (
		<>
			<Box sx={{ mt: 5 }}>
				{!isEdit ? (
					<TextEditor
						height={200}
						state={data.description}
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
								<Box>Posted By: {data.nick_name}</Box>
								<Box>Posted on: {dateFormatter(data.date_created)}</Box>
								<Box>
									<ThumbUp
										fontSize='small'
										color={currentVote.type === 'likes' ? 'primary' : 'action'}
										onClick={
											!currentVote.id
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
												: currentVote.type === 'likes'
												? (e) => {
														const updateCommentPayload: UpdateCommentPayload = {
															id: data.id,
															likes: Number(data.likes) - 1,
														};
														let id: any = null;
														if (currentVote.id) {
															id = currentVote.id;
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
									&nbsp;{data.likes}
								</Box>
								<Box>
									<ThumbDown
										fontSize='small'
										color={
											currentVote.type === 'dislikes' ? 'warning' : 'action'
										}
										onClick={
											!currentVote.id
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
												: currentVote.type === 'dislikes'
												? (e) => {
														const updateCommentPayload: UpdateCommentPayload = {
															id: data.id,
															dislikes: Number(data.dislikes) - 1,
														};
														let id: any = null;
														if (currentVote.id) {
															id = currentVote.id;
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
