import React, { useEffect } from 'react';
import TimeseriesChart from './chartComponents/TimeseriesChart/index';

const PriceChart = ({ priceData }) => {
	priceData = priceData.map((data) => ({
		label: new Date(data['date']),
		value: data['price'],
		tooltipContent: `$${data['price'].toFixed(2)}`,
	}));

	console.log('priceData', priceData);

	return (
		<TimeseriesChart
			svgProps={{
				width: 800,
				height: 800,
				margin: { top: 50, right: 50, bottom: 50, left: 50 },
			}}
			axisProps={{
				xLabel: 'Time',
				yLabel: 'Price',
			}}
			data={priceData}
			strokeWidth={1}
		/>
	);
};

export default PriceChart;
