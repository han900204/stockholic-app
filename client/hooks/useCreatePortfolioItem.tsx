import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	CreatePortfolioItemPayload,
	CreatePortfolioItemResponse,
	GetPortfolioItemsResponse,
} from '../constants/GQL_INTERFACE';

export function useCreatePortfolioItem() {
	const [createPortfolioItem, { data, error }] = useMutation<
		CreatePortfolioItemResponse,
		CreatePortfolioItemPayload
	>(GQL_QUERY.CREATE_PORTFOLIO_ITEM_QUERY, {
		update(cache, { data }) {
			const newItem = data?.createPortfolioItem;
			const existingItems = cache.readQuery<GetPortfolioItemsResponse>({
				query: GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY,
				variables: {
					portfolio_id: newItem?.portfolio_id,
				},
			});
			if (existingItems && newItem) {
				cache.writeQuery({
					query: GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY,
					variables: {
						portfolio_id: newItem?.portfolio_id,
					},
					data: {
						getPortfolioItems: [...existingItems?.getPortfolioItems, newItem],
					},
				});
			}
		},
	});
	return { createPortfolioItem, data, error };
}
