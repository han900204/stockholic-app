import React from 'react';
import ThumbUp from '@mui/icons-material/ThumbUp';
import {
	UpdateCommentPayload,
	CreateVotePayload,
	DeleteVotePayload,
} from '../constants/GQL_INTERFACE';

const Likes = ({
	investorId,
	commentData,
	vote,
	handleCreateVote,
	handleDeleteVote,
}) => {
	return (
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
							handleCreateVote(updateCommentPayload, createVotePayload);
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
							handleDeleteVote(updateCommentPayload, deleteVotePayload);
					  }
					: undefined
			}
		/>
	);
};

export default Likes;
