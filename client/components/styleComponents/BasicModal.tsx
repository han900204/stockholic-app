import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Btn from '../styleComponents/Btn';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export default function BasicModal({
	buttonName,
	heading,
	Component,
	isMenu,
}: {
	buttonName: string;
	heading: string;
	Component: any;
	isMenu?: boolean;
}) {
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	if (isMenu === undefined) isMenu = false;

	return (
		<div>
			{!isMenu ? (
				<Btn type='button' text={buttonName} eHandler={handleOpen} />
			) : (
				<MenuItem
					onClick={() => {
						handleOpen();
					}}
				>
					<Typography textAlign='center'>{buttonName}</Typography>
				</MenuItem>
			)}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={style}>
					<Grid container spacing={24}>
						<Grid item xs={8}>
							<Typography id='modal-modal-title' variant='h6' component='h2'>
								{heading}
							</Typography>
						</Grid>
						<Grid item xs={0}>
							<IconButton onClick={handleClose}>
								<CloseIcon />
							</IconButton>
						</Grid>
					</Grid>
					{Component(handleClose)}
				</Box>
			</Modal>
		</div>
	);
}
