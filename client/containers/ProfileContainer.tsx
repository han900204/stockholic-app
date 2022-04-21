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
	GetInvestorResponse,
} from '../constants/GQL_INTERFACE';
import GQL_QUERY from '../constants/GQL_QUERY';
import ForumTable from '../components/ForumTable';
import { v4 as uuidv4 } from 'uuid';
import { setS3Location } from '../features/investorSlice';
import uploadToS3 from '../snippets/uploadToS3';
import ProfilePic from '../components/styleComponents/ProfilePic';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';

const ProfileContainer = () => {
	const [image, setImage] = useState<File | null>(null);
	const dispatch = useDispatch();
	const params = useParams();
	const profileOwnerId = Number(params.investorId);

	const { investorId } = useSelector((state: RootState) => state.investor);

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
		variables: { owner_user_id: profileOwnerId },
	});

	const profileOwnerRes = useQuery<GetInvestorResponse>(
		GQL_QUERY.GET_INVESTOR_QUERY,
		{
			variables: { id: profileOwnerId },
		}
	);

	if (loading) return <LoadingForm />;

	return (
		<>
			<Box
				sx={{
					margin: 'auto',
					width: '80%',
				}}
			>
				<Subheading title='User Profile' />
				<ProfilePic
					sxStyle={{ width: 100, height: 100, mb: 3 }}
					s3Location={profileOwnerRes.data?.getInvestor.s3_location}
				/>
				<Subheading2 title={profileOwnerRes.data?.getInvestor.nick_name} />
				{profileOwnerId === investorId ? (
					<>
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
										await updateProfilePicture({
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
					</>
				) : (
					<></>
				)}

				<Subheading2 title={`User's Postings`} />
				<ForumTable data={data} />
			</Box>
		</>
	);
};

export default ProfileContainer;
