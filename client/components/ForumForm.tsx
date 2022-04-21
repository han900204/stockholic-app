import React, { useState } from 'react';
import Subheading from './styleComponents/Subheading';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import { useUpdateForum } from '../hooks/useUpdateForum';
import {
	ForumData,
	UpdateForumPayload,
	DeleteForumPayload,
} from '../constants/GQL_INTERFACE';
import { useDeleteForum } from '../hooks/useDeleteForum';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import TextEditor from './styleComponents/TextEditor';

const ForumForm = ({ data, investorId, investorProfilePic }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [description, setDescription] = useState('');
	const navigate = useNavigate();

	const forum: ForumData = data.getForum;

	const { updateForum } = useUpdateForum();

	const { deleteForum } = useDeleteForum();

	const updateForumPayload: UpdateForumPayload = {
		id: forum.id,
		description: description,
	};

	const deleteForumPayload: DeleteForumPayload = {
		id: forum.id,
	};

	const handleClick = async (e: any) => {
		e.preventDefault();

		try {
			await updateForum({ variables: updateForumPayload });
		} catch (e: any) {
			console.log('ERROR: ', e);
		}
	};

	return (
		<>
			<Box
				sx={{
					margin: 'auto',
					width: '80%',
				}}
			>
				<Subheading title={forum.name} />
				<Grid container spacing={2} sx={{ mb: 1 }}>
					<Grid item xs={8}>
						Posted By: {forum.nick_name}
					</Grid>
					<Grid item xs={4}>
						<Box display='flex' justifyContent='flex-end'>
							Posted on:{' '}
							{new Date(forum.date_created).toISOString().split('T')[0]}
						</Box>
					</Grid>
				</Grid>
				{!isEdit ? (
					<>
						<TextEditor
							height={500}
							state={forum.description}
							setState={setDescription}
							permission={isEdit}
						/>
						{investorId === forum.owner_user_id ? (
							<>
								<Stack
									direction='row'
									spacing={2}
									justifyContent='right'
									alignItems='right'
								>
									<Btn
										text='Edit'
										type='button'
										eHandler={() => {
											setDescription(forum.description);
											setIsEdit(true);
										}}
									/>
									<Btn
										text='Delete'
										type='button'
										eHandler={async (e) => {
											await deleteForum({ variables: deleteForumPayload });
											navigate('/forum');
										}}
									/>
								</Stack>
							</>
						) : (
							<></>
						)}
					</>
				) : (
					<>
						<TextEditor
							height={500}
							state={description}
							setState={setDescription}
							permission={isEdit}
						/>
						<Stack
							direction='row'
							spacing={2}
							justifyContent='right'
							alignItems='right'
						>
							<Btn
								text='Done'
								type='button'
								eHandler={(e) => {
									handleClick(e);
									setIsEdit(false);
								}}
							/>
						</Stack>
					</>
				)}
			</Box>
		</>
	);
};

export default ForumForm;
