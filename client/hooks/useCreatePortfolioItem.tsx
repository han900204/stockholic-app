import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	CreatePortfolioItemsPayload,
	CreatePortfolioItemsResponse,
	GetPortfolioItemsResponse,
} from '../constants/GQL_INTERFACE';

export function useCreatePortfolioItems() {
	const [createPortfolioItems, { data, error }] = useMutation<
		CreatePortfolioItemsResponse,
		CreatePortfolioItemsPayload
	>(GQL_QUERY.CREATE_PORTFOLIO_ITEMS_QUERY, {
		update(cache, { data }) {
			const newItems = data?.createPortfolioItems;
			if (newItems && newItems.length > 0) {
				const existingItems = cache.readQuery<GetPortfolioItemsResponse>({
					query: GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY,
					variables: {
						portfolio_id: newItems[0].portfolio_id,
					},
				});
				if (existingItems) {
					cache.writeQuery({
						query: GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY,
						variables: {
							portfolio_id: newItems[0].portfolio_id,
						},
						data: {
							getPortfolioItems: [
								...existingItems?.getPortfolioItems,
								...newItems,
							],
						},
					});
				}
			}
			console.log('hey', cache);
		},
	});
	return { createPortfolioItems, data, error };
}
