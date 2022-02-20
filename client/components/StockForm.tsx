import React, { useState, useEffect } from 'react';
import Subheading from './styleComponents/Subheading';
import PriceChart from './PriceChart';
import {} from '../constants/GQL_INTERFACE';

const StockForm = ({ summaryData, priceData }) => {
	return (
		<>
			<Subheading title={summaryData?.short_name} />
			<div>Add Summary Info Here</div>
			<PriceChart />
		</>
	);
};

export default StockForm;
