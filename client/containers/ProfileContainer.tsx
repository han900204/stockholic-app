import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Subheading from '../components/styleComponents/Subheading';
import Subheading2 from '../components/styleComponents/Subheading2';
import LoadingForm from '../components/LoadingForm';
import { useQuery } from '@apollo/client';
import {
	GetForumsPayload,
	GetForumsResponse,
} from '../constants/GQL_INTERFACE';
import GQL_QUERY from '../constants/GQL_QUERY';
import ForumTable from '../components/ForumTable';
import Avatar from '@mui/material/Avatar';

const ProfileContainer = () => {
	const [image, setImage] = useState<File | null>(null);

	const { investorId, nickName, s3_location } = useSelector(
		(state: RootState) => state.investor
	);

	const { loading, error, data } = useQuery<
		GetForumsResponse,
		GetForumsPayload
	>(GQL_QUERY.GET_FORUMS_QUERY, {
		variables: { owner_user_id: investorId },
	});

	if (loading) return <LoadingForm />;

	return (
		<>
			<Subheading title='User Profile' />
			<Avatar
				alt='Remy Sharp'
				src={s3_location ? s3_location : ''}
				sx={{ width: 100, height: 100, mb: 3 }}
			/>
			<Subheading2 title={nickName} />
			<input
				type='file'
				name='img'
				onChange={(event) => {
					if (event.target.files) {
						setImage(event.target.files[0]);
					}
				}}
			/>
			<button
				onClick={(event) => {
					console.log('Sending to server to process');
				}}
			>
				Upload
			</button>

			<Subheading2 title={`User's Postings`} />
			<ForumTable data={data} />
		</>
	);
};

export default ProfileContainer;
