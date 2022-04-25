import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';
import {
	setIsAuthenticated,
	setIsPending,
	setInvestorId,
	setNickName,
	setInvestors,
	setS3Location,
} from './features/investorSlice';
import { setSymbols } from './features/stockSlice';
import GQL_QUERY from './constants/GQL_QUERY';
import { useLazyQuery } from '@apollo/client';
import {
	GetAuthPayload,
	GetInvestorsResponse,
	GetSymbolsResponse,
} from './constants/GQL_INTERFACE';
import useTheme from './hooks/useTheme';
import LoginContainer from './containers/LoginContainer';
import SignUpContainer from './containers/SignUpContainer';
import ProfileContainer from './containers/ProfileContainer';
import ForumListContainer from './containers/ForumListContainer';
import NavContainer from './containers/NavContainer';
import LoadingForm from './components/LoadingForm';
import ForumContainer from './containers/ForumContainer';
import ChatContainer from './containers/ChatContainer';
import StockListContainer from './containers/StockListContainer';
import StockContainer from './containers/StockContainer';
import PortfolioContainer from './containers/PortfolioContainer';

const App = () => {
	const { theme } = useTheme();
	const { isAuthenticated, isPending } = useSelector(
		(state: RootState) => state.investor
	);
	const dispatch = useDispatch();

	const [getAuthentication] = useLazyQuery(GQL_QUERY.GET_AUTHENTICATION_QUERY);

	const authPayload: GetAuthPayload = {
		token: sessionStorage.getItem('token'),
	};

	const [getInvestors] = useLazyQuery<GetInvestorsResponse, null>(
		GQL_QUERY.GET_INVESTORS_QUERY
	);

	const [getSymbols] = useLazyQuery<GetSymbolsResponse, null>(
		GQL_QUERY.GET_SYMBOLS_QUERY
	);

	useEffect(() => {
		const asyncGetAuth = async () => {
			await dispatch(setIsPending(true));
			const res = await getAuthentication({ variables: authPayload });
			const investors = await getInvestors();
			const symbols = await getSymbols();

			if (res.data.getAuthentication) {
				await dispatch(setIsAuthenticated(true));
				await dispatch(setInvestorId(res.data.getAuthentication.investor_id));
				await dispatch(setNickName(res.data.getAuthentication.nick_name));
				await dispatch(setS3Location(res.data.getAuthentication.s3_location));
				if (investors?.data?.getInvestors) {
					await dispatch(setInvestors(investors.data.getInvestors));
				}
				if (symbols?.data?.getSymbols) {
					await dispatch(setSymbols(symbols.data.getSymbols));
				}
			}
			await dispatch(setIsPending(false));
		};
		asyncGetAuth();
	}, []);

	if (!isAuthenticated && isPending) {
		return <LoadingForm />;
	} else {
		return isAuthenticated ? (
			<ThemeProvider theme={theme}>
				<Router>
					<NavContainer />
					<div>
						<Routes>
							<Route
								path='/profile/:investorId'
								element={<ProfileContainer />}
							/>
							<Route path='/portfolio' element={<PortfolioContainer />} />
							<Route path='/chat/:investorId' element={<ChatContainer />} />
							<Route path='/forum' element={<ForumListContainer />} />
							<Route path='/forum/:id' element={<ForumContainer />} />
							<Route path='/stocks' element={<StockListContainer />} />
							<Route path='/stocks/:symbolId' element={<StockContainer />} />
							<Route path='/*' element={<Navigate to='/forum' />} />
						</Routes>
					</div>
				</Router>
			</ThemeProvider>
		) : (
			<Router>
				<div>
					<Routes>
						<Route path='/login' element={<LoginContainer />} />
						<Route path='/signup' element={<SignUpContainer />} />
						<Route path='/*' element={<Navigate to='/login' />} />
					</Routes>
				</div>
			</Router>
		);
	}
};

export default App;
