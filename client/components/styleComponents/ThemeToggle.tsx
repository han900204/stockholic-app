import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import { setMode } from '../../features/themeSlice';
import Typography from '@mui/material/Typography';

export default function ThemeToggle() {
	const dispatch = useDispatch();
	const theme = useTheme();
	const mode: 'light' | 'dark' = useSelector(
		(state: RootState) => state.theme.mode
	);

	return (
		<IconButton
			onClick={() => {
				if (mode === 'light') {
					dispatch(setMode('dark'));
				} else {
					dispatch(setMode('light'));
				}
			}}
			color='inherit'
			disableFocusRipple={true}
			disableRipple={true}
			sx={{
				p: 0,
			}}
		>
			<Typography textAlign='center'>
				{mode.replace(mode[0], mode[0].toUpperCase())} mode &nbsp;
			</Typography>
			{theme.palette.mode === 'dark' ? (
				<Brightness7Icon />
			) : (
				<Brightness4Icon />
			)}
		</IconButton>
	);
}
