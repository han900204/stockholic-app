import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	CreatePortfolioPayload,
	CreatePortfolioResponse,
	GetPortfoliosResponse,
} from '../constants/GQL_INTERFACE';

export function useCreatePortfolio() {
	const [createPortfolio, { data, error }] = useMutation<
		CreatePortfolioResponse,
		CreatePortfolioPayload
	>(GQL_QUERY.CREATE_PORTFOLIO_QUERY, {
		update(cache, { data }) {
			const newPort = data?.createPortfolio;
			const existingPorts = cache.readQuery<GetPortfoliosResponse>({
				query: GQL_QUERY.GET_PORTFOLIOS_QUERY,
				variables: {
					investor_id: newPort?.investor_id,
				},
			});
			if (existingPorts && newPort) {
				cache.writeQuery({
					query: GQL_QUERY.GET_PORTFOLIOS_QUERY,
					variables: {
						investor_id: newPort?.investor_id,
					},
					data: {
						getPortfolios: [newPort, ...existingPorts?.getPortfolios],
					},
				});
			}
		},
	});
	return { createPortfolio, data, error };
}
