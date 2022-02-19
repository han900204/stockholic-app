/**
 * Style type for forum table
 */
export interface ForumColumn {
	id: 'id' | 'name' | 'nick_name' | 'date_created';
	label: string;
	minWidth?: number;
	align?: 'right';
	format?: (value: number) => string;
}

export interface ForumData {
	id: number;
	name: string;
	nick_name: string;
	date_created: string;
}

/**
 * Style type for stock table
 */

export interface SummaryData {
	id: number;
	symbol: string;
	sector: string | null;
	current_price: number | null;
	recommendation_key: string | null;
	target_mean_price: number | null;
	earnings_growth: number | null;
	current_ratio: number | null;
	debt_to_equity: number | null;
	return_on_equity: number | null;
	short_name: string | null;
	price_to_book: number | null;
	forward_pe: number | null;
	dividend_yield: number | null;
}

export interface SummaryColumn {
	id:
		| 'id'
		| 'symbol'
		| 'sector'
		| 'current_price'
		| 'recommendation_key'
		| 'target_mean_price'
		| 'earnings_growth'
		| 'current_ratio'
		| 'debt_to_equity'
		| 'return_on_equity'
		| 'short_name'
		| 'price_to_book'
		| 'forward_pe'
		| 'dividend_yield';
	label: string;
	minWidth?: number;
	align?: 'right';
	format?: (value: number) => string;
}

/**
 * Style for multi select dropdown
 */
export interface MultiSelectOption {
	value: string;
	label: string;
}
