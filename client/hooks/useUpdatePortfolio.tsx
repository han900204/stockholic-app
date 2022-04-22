import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	UpdatePortfolioResponse,
	UpdatePortfolioPayload,
	GetPortfoliosResponse,
	PortfolioData,
} from '../constants/GQL_INTERFACE';

export function useUpdatePortfolio() {
	const [updatePortfolio, { data, error }] = useMutation<
		UpdatePortfolioResponse,
		UpdatePortfolioPayload
	>(GQL_QUERY.UPDATE_PORTFOLIO_QUERY, {
		update(cache, { data }) {
			const updatedPort = data?.updatePortfolio;
			const existingPorts = cache.readQuery<GetPortfoliosResponse>({
				query: GQL_QUERY.GET_PORTFOLIOS_QUERY,
				variables: {
					investor_id: updatedPort?.investor_id,
				},
			});
			if (existingPorts && updatedPort) {
				cache.writeQuery({
					query: GQL_QUERY.GET_PORTFOLIOS_QUERY,
					variables: {
						investor_id: updatedPort?.investor_id,
					},
					data: {
						getPortfolios: existingPorts?.getPortfolios.reduce(
							(portfolios: PortfolioData[], portfolio: PortfolioData) => {
								if (portfolio.id !== updatedPort.id) {
									portfolios.push(portfolio);
								} else {
									portfolios.push(updatedPort);
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
	return { updatePortfolio, data, error };
}
