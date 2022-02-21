import React, { useEffect, useRef, useState } from 'react';
import TimeseriesChart from './chartComponents/TimeseriesChart/index';
import { Box } from '@material-ui/core';

const PriceChart = ({ priceData }) => {
	const [width, setWidth] = useState<undefined | number>();
	const ref = useRef<null | HTMLDivElement>(null);

	useEffect(() => {
		if (ref?.current?.parentElement?.offsetWidth) {
			setWidth(ref.current.parentElement.offsetWidth * 0.8);
		}
		window.addEventListener('resize', () => {
			if (ref?.current?.parentElement?.offsetWidth) {
				setWidth(ref.current.parentElement.offsetWidth * 0.8);
			}
		});
	});

	priceData = priceData.map((data) => ({
		label: new Date(data['date']),
		value: data['price'],
		tooltipContent: `$${data['price'].toFixed(2)}`,
	}));

	return (
		<>
			<Box display='flex' alignItems='center' justifyContent='center'>
				<div ref={ref} />
				<TimeseriesChart
					svgProps={{
						width: width,
						height: 400,
						margin: { top: 50, right: 50, bottom: 50, left: 50 },
					}}
					axisProps={{
						xLabel: 'Time',
						yLabel: 'Price',
					}}
					data={priceData}
					strokeWidth={1}
				/>
			</Box>
		</>
	);
};

export default PriceChart;
