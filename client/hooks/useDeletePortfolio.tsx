import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	DeletePortfolioResponse,
	DeletePortfolioPayload,
	GetPortfoliosResponse,
	PortfolioData,
} from '../constants/GQL_INTERFACE';

export function useDeletePortfolio() {
	const [deletePortfolio, { data, error }] = useMutation<
		DeletePortfolioResponse,
		DeletePortfolioPayload
	>(GQL_QUERY.DELETE_PORTFOLIO_QUERY, {
		update(cache, { data }) {
			const deletedPort = data?.deletePortfolio;
			const existingPorts = cache.readQuery<GetPortfoliosResponse>({
				query: GQL_QUERY.GET_PORTFOLIOS_QUERY,
				variables: {
					investor_id: deletedPort?.investor_id,
				},
			});
			if (existingPorts && deletedPort) {
				cache.writeQuery({
					query: GQL_QUERY.GET_PORTFOLIOS_QUERY,
					variables: {
						investor_id: deletedPort?.investor_id,
					},
					data: {
						getPortfolios: existingPorts?.getPortfolios.reduce(
							(portfolios: PortfolioData[], portfolio: PortfolioData) => {
								if (portfolio.id !== deletedPort.id) {
									portfolios.push(portfolio);
								}
								return portfolios;
							},
							[]
						),
					},
				});
			}
		},
	});
	return { deletePortfolio, data, error };
}
