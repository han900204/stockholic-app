import React, { useState, useEffect } from 'react';
import Subheading from './styleComponents/Subheading';
import {} from '../constants/GQL_INTERFACE';

const ForumForm = ({ data }) => {
	return (
		<>
			<Subheading title={data.short_name} />
		</>
	);
};

export default ForumForm;
