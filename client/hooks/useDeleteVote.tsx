import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	DeleteVotePayload,
	DeleteVoteResponse,
	GetVotesResponse,
	VoteData,
} from '../constants/GQL_INTERFACE';

export function useDeleteVote() {
	const [deleteVote, { data, error }] = useMutation<
		DeleteVoteResponse,
		DeleteVotePayload
	>(GQL_QUERY.DELETE_VOTE_QUERY, {
		update(cache, { data }) {
			const deletedVote = data?.deleteVote;
			const existingVotes = cache.readQuery<GetVotesResponse>({
				query: GQL_QUERY.GET_VOTES_QUERY,
				variables: {
					comment_id: deletedVote?.comment_id,
					investor_id: deletedVote?.investor_id,
				},
			});
			if (existingVotes && deletedVote) {
				cache.writeQuery({
					query: GQL_QUERY.GET_VOTES_QUERY,
					variables: {
						comment_id: deletedVote?.comment_id,
						investor_id: deletedVote?.investor_id,
					},
					data: {
						getVotes: existingVotes?.getVotes.reduce(
							(votes: VoteData[], vote) => {
								if (vote.id !== deletedVote.id) {
									votes.push(vote);
								}
								return votes;
							},
							[]
						),
					},
				});
			}
		},
	});
	return { deleteVote, data, error };
}
