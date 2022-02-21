import React, { useState, useEffect } from 'react';
import Subheading from './styleComponents/Subheading';
import PriceChart from './PriceChart';
import SummaryForm from './SummaryForm';
import {} from '../constants/GQL_INTERFACE';

const StockForm = ({ summaryData, priceData }) => {
	console.log('Price Data', priceData);
	return (
		<>
			<Subheading title={summaryData?.short_name} />
			<PriceChart />
			<SummaryForm summaryData={summaryData} />
		</>
	);
};

export default StockForm;
