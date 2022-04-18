import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import useLogout from '../hooks/useLogout';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ThemeToggle from '../components/styleComponents/ThemeToggle';

const NavContainer = () => {
	const { investorId, s3_location } = useSelector(
		(state: RootState) => state.investor
	);
	console.log('nav', investorId, s3_location);
	const { logout } = useLogout();

	const pages: any[] = [
		{ name: 'Stocks', url: '/stocks' },
		{ name: 'Portfolio', url: `/portfolio` },
		{ name: 'Forums', url: '/forum' },
		{ name: 'Chat', url: `/chat/${investorId}` },
	];
	const settings: any[] = [
		{ name: 'Profile', url: `/profile/${investorId}` },
		{ name: 'Account', url: '' },
		{ name: 'Theme' },
		{ name: 'Logout' },
	];

	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position='static'>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
					>
						LOGO
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
							color='inherit'
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page, idx) => (
								<Link
									key={idx}
									to={page.url}
									style={{ textDecoration: 'none' }}
								>
									<MenuItem onClick={handleCloseNavMenu}>
										<Typography textAlign='center'>{page.name}</Typography>
									</MenuItem>
								</Link>
							))}
						</Menu>
					</Box>
					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
					>
						LOGO
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page, idx) => (
							<Link key={idx} to={page.url} style={{ textDecoration: 'none' }}>
								<Button
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: 'white', display: 'block' }}
								>
									{page.name}
								</Button>
							</Link>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title='Open settings'>
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt='Remy Sharp' src={s3_location ? s3_location : ''} />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id='menu-appbar'
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting, idx) => {
								if (setting.name === 'Theme') {
									return (
										<MenuItem key={idx}>
											<ThemeToggle />
										</MenuItem>
									);
								} else if (setting.name === 'Logout') {
									return (
										<MenuItem
											key={idx}
											onClick={() => {
												handleCloseUserMenu();
												logout();
											}}
										>
											<Typography textAlign='center'>{setting.name}</Typography>
										</MenuItem>
									);
								} else {
									return (
										<Link
											key={idx}
											to={setting.url}
											style={{ textDecoration: 'none' }}
										>
											<MenuItem onClick={handleCloseUserMenu}>
												<Typography textAlign='center'>
													{setting.name}
												</Typography>
											</MenuItem>
										</Link>
									);
								}
							})}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default NavContainer;
