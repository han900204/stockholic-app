import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	CreateVotePayload,
	CreateVoteResponse,
	GetVotesResponse,
} from '../constants/GQL_INTERFACE';

export function useCreateVote() {
	const [createVote, { data, error }] = useMutation<
		CreateVoteResponse,
		CreateVotePayload
	>(GQL_QUERY.CREATE_VOTE_QUERY, {
		update(cache, { data }) {
			const newVote = data?.createVote;
			const existingVotes = cache.readQuery<GetVotesResponse>({
				query: GQL_QUERY.GET_VOTES_QUERY,
				variables: {
					forum_id: newVote?.forum_id,
					investor_id: newVote?.investor_id,
				},
			});
			if (existingVotes && newVote) {
				cache.writeQuery({
					query: GQL_QUERY.GET_VOTES_QUERY,
					variables: {
						forum_id: newVote?.forum_id,
						investor_id: newVote?.investor_id,
					},
					data: {
						getVotes: [newVote, ...existingVotes?.getVotes],
					},
				});
			}
		},
	});
	return { createVote, data, error };
}
