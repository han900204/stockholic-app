import React from 'react';
import { useLazyQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	GetPortfolioItemsPayload,
	GetPortfolioItemsResponse,
} from '../constants/GQL_INTERFACE';

export function useGetPortfolioItems() {
	const [getPortfolioItems] = useLazyQuery<
		GetPortfolioItemsResponse,
		GetPortfolioItemsPayload
	>(GQL_QUERY.GET_PORTFOLIO_ITEMS_QUERY);
	return { getPortfolioItems };
}
