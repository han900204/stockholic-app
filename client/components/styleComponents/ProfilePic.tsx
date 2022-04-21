import Avatar from '@mui/material/Avatar';
import React from 'react';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';

const ProfilePic = ({
	sxStyle,
	s3Location,
}: {
	sxStyle?: {
		width?: number;
		height?: number;
		mb?: number;
		mt?: number;
	};
	s3Location?: string;
}) => {
	const s3_location = s3Location
		? s3Location
		: useSelector((state: RootState) => state.investor.s3_location);
	return (
		<Avatar
			alt='Remy Sharp'
			src={s3_location ? s3_location : ''}
			sx={sxStyle ? sxStyle : null}
		/>
	);
};

export default ProfilePic;
