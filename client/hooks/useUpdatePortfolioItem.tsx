import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	UpdatePortfolioItemPayload,
	UpdatePortfolioItemResponse,
	GetPortfolioItemsResponse,
	PortfolioItemData,
} from '../constants/GQL_INTERFACE';

export function useUpdatePortfolioItem() {
	const [updatePortfolioItem, { data, error }] = useMutation<
		UpdatePortfolioItemResponse,
		UpdatePortfolioItemPayload
	>(GQL_QUERY.UPDATE_PORTFOLIO_ITEM_QUERY, {
		update(cache, { data }) {
			const updatedItem = data?.updatePortfolioItem;
			const existingItems = cache.readQuery<GetPortfolioItemsResponse>({
				query: GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY,
				variables: {
					portfolio_id: updatedItem?.portfolio_id,
				},
			});
			if (existingItems && updatedItem) {
				cache.writeQuery({
					query: GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY,
					variables: {
						portfolio_id: updatedItem?.portfolio_id,
					},
					data: {
						getPortfolioItems: existingItems?.getPortfolioItems.reduce(
							(items: PortfolioItemData[], item: PortfolioItemData) => {
								if (item.id !== updatedItem.id) {
									items.push(item);
								} else {
									items.push(updatedItem);
								}
								return items;
							},
							[]
						),
					},
				});
			}
		},
	});
	return { updatePortfolioItem, data, error };
}
