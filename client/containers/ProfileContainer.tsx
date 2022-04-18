import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Subheading from '../components/styleComponents/Subheading';
import Subheading2 from '../components/styleComponents/Subheading2';
import LoadingForm from '../components/LoadingForm';
import { useQuery, useMutation } from '@apollo/client';
import {
	GetForumsPayload,
	GetForumsResponse,
	SignS3Response,
	SignS3Payload,
} from '../constants/GQL_INTERFACE';
import GQL_QUERY from '../constants/GQL_QUERY';
import ForumTable from '../components/ForumTable';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';

const ProfileContainer = () => {
	const [image, setImage] = useState<File | null>(null);

	const { investorId, nickName, s3_location } = useSelector(
		(state: RootState) => state.investor
	);

	const [signS3] = useMutation<SignS3Response, SignS3Payload>(
		GQL_QUERY.SIGN_S3_QUERY
	);

	const { loading, error, data } = useQuery<
		GetForumsResponse,
		GetForumsPayload
	>(GQL_QUERY.GET_FORUMS_QUERY, {
		variables: { owner_user_id: investorId },
	});
	console.log('image', image);

	const uploadToS3 = async (file, signedRequest) => {
		const options = {
			headers: {
				'Content-Type': file.type,
			},
		};
		await axios.put(signedRequest, file, options);
	};

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
				onClick={async (event) => {
					let res: any = null;
					if (image) {
						res = await signS3({
							variables: {
								fileName: image.name,
								fileType: image.type,
								directory: 'profile',
							},
						});
					}
					console.log(res);
					const upload = await uploadToS3(image, res.data.signS3.signedRequest);
					console.log(upload);
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
