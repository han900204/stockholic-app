import React from 'react';
import { useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	DeletePortfolioItemResponse,
	DeletePortfolioItemPayload,
	GetPortfolioItemsResponse,
	PortfolioItemData,
} from '../constants/GQL_INTERFACE';

export function useDeletePortfolioItem() {
	const [deletePortfolioItem, { data, error }] = useMutation<
		DeletePortfolioItemResponse,
		DeletePortfolioItemPayload
	>(GQL_QUERY.DELETE_PORTFOLIO_ITEM_QUERY, {
		update(cache, { data }) {
			const deletedItem = data?.deletePortfolioItem;
			const existingItems = cache.readQuery<GetPortfolioItemsResponse>({
				query: GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY,
				variables: {
					portfolio_id: deletedItem?.portfolio_id,
				},
			});
			if (existingItems && deletedItem) {
				cache.writeQuery({
					query: GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY,
					variables: {
						portfolio_id: deletedItem?.portfolio_id,
					},
					data: {
						getPortfolioItems: existingItems?.getPortfolioItems.reduce(
							(items: PortfolioItemData[], item: PortfolioItemData) => {
								if (item.id !== deletedItem.id) {
									items.push(item);
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
	return { deletePortfolioItem, data, error };
}
