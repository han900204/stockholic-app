import React, { useEffect } from 'react';
import LineChart from './chartComponents/LineChart/index';

const PriceChart = () => {
	const priceData = [
		{ value: 100, label: 1, tooltipContent: 100 },
		{ value: 200, label: 2, tooltipContent: 200 },
		{ value: 300, label: 3, tooltipContent: 300 },
		{ value: 400, label: 4, tooltipContent: 400 },
		{ value: 300, label: 5, tooltipContent: 300 },
	];

	return (
		<LineChart
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
