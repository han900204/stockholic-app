import React, { useState } from 'react';
import Subheading from './styleComponents/Subheading';
import Box from '@mui/material/Box';
import Btn from './styleComponents/Btn';
import { useUpdateForum } from '../hooks/useUpdateForum';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	ForumData,
	UpdateForumPayload,
	DeleteForumPayload,
	GetInvestorResponse,
} from '../constants/GQL_INTERFACE';
import { useDeleteForum } from '../hooks/useDeleteForum';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import TextEditor from './styleComponents/TextEditor';
import ProfilePic from './styleComponents/ProfilePic';
import { CardHeader } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const ForumForm = ({ data, investorId }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [description, setDescription] = useState('');
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const ITEM_HEIGHT = 48;
	const open = Boolean(anchorEl);
	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const forum: ForumData = data.getForum;

	const forumOwnerRes = useQuery<GetInvestorResponse>(
		GQL_QUERY.GET_INVESTOR_QUERY,
		{
			variables: { id: forum.owner_user_id },
		}
	);

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
				<Subheading
					title={`${forum.name} - ${
						new Date(forum.date_created).toISOString().split('T')[0]
					}`}
				/>

				<CardHeader
					avatar={
						<ProfilePic
							sxStyle={{ width: 50, height: 50 }}
							s3Location={forumOwnerRes.data?.getInvestor.s3_location}
						/>
					}
					title={forum.nick_name}
					onClick={handleOpen}
				/>
				<Menu
					id='long-menu'
					MenuListProps={{
						'aria-labelledby': 'long-button',
					}}
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					PaperProps={{
						style: {
							maxHeight: ITEM_HEIGHT * 4.5,
							width: '20ch',
						},
					}}
				>
					<MenuItem
						onClick={() => {
							navigate(`/profile/${forum.owner_user_id}`);
						}}
					>
						<Typography textAlign='center'>Visit Profile</Typography>
					</MenuItem>
				</Menu>

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
