import React from 'react';
import ThumbUp from '@mui/icons-material/ThumbUp';
import {
	UpdateCommentPayload,
	CreateVotePayload,
	DeleteVotePayload,
} from '../constants/GQL_INTERFACE';
import ThumbDown from '@mui/icons-material/ThumbDown';

const Dislikes = ({
	investorId,
	commentData,
	vote,
	handleCreateVote,
	handleDeleteVote,
}) => {
	return (
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
							handleCreateVote(updateCommentPayload, createVotePayload);
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
							handleDeleteVote(updateCommentPayload, deleteVotePayload);
					  }
					: undefined
			}
		/>
	);
};

export default Dislikes;
