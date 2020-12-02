import React, {useEffect, useState}from 'react';
import { Chart, LineAdvance } from 'bizcharts';

function Demo( {primary} ) {
	return <Chart padding={[10, 20, 50, 40]} autoFit height={300} data={primary} >
		<LineAdvance
			shape="smooth"
			point
			area
			position="month*temperature"
			color="city"
		/>
	</Chart>
}

export default Demo;