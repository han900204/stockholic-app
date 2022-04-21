import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
	UpdateProfilePicturePayload,
	UpdateProfilePictureResponse,
} from '../constants/GQL_INTERFACE';
import GQL_QUERY from '../constants/GQL_QUERY';
import ForumTable from '../components/ForumTable';
import Avatar from '@mui/material/Avatar';
import { v4 as uuidv4 } from 'uuid';
import { setS3Location } from '../features/investorSlice';
import uploadToS3 from '../snippets/uploadToS3';

const ProfileContainer = () => {
	const [image, setImage] = useState<File | null>(null);
	const dispatch = useDispatch();

	const { investorId, nickName, s3_location } = useSelector(
		(state: RootState) => state.investor
	);

	const [signS3] = useMutation<SignS3Response, SignS3Payload>(
		GQL_QUERY.SIGN_S3_QUERY
	);

	const [updateProfilePicture] = useMutation<
		UpdateProfilePictureResponse,
		UpdateProfilePicturePayload
	>(GQL_QUERY.UPDATE_PROFILE_PICTURE);

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
				onClick={async (event) => {
					let res: any = null;
					if (image) {
						res = await signS3({
							variables: {
								fileName: `${investorId}-${uuidv4()}`,
								fileType: image.type,
								directory: 'profile',
							},
						});
					}

					const { signedRequest, url } = res.data.signS3;
					const upload = await uploadToS3(image, signedRequest);
					if (upload.status === 200) {
						if (investorId) {
							const updateStatus = await updateProfilePicture({
								variables: {
									id: investorId,
									s3_location: url,
								},
							});
							await dispatch(setS3Location(url));
						}
					}
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
