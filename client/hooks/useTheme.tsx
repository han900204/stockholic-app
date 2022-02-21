import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export default function useTheme() {
	const mode: 'light' | 'dark' = useSelector(
		(state: RootState) => state.theme.mode
	);

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode]
	);

	return {
		theme,
	};
}
