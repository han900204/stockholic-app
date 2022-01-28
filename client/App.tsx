import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';
import { setIsAuthenticated, setIsPending } from './features/investorSlice';
import GQL_QUERY from './constants/GQL_QUERY';
import { useLazyQuery } from '@apollo/client';
import { GetAuthPayload } from './constants/GQL_INTERFACE';
import LoginContainer from './containers/LoginContainer';
import SignUpContainer from './containers/SignUpContainer';
import ProfileContainer from './containers/ProfileContainer';
import LoadingForm from './components/LoadingForm';

const App = () => {
  const { isAuthenticated, isPending } = useSelector(
    (state: RootState) => state.investor
  );
  const dispatch = useDispatch();

  const [getAuthentication] = useLazyQuery(GQL_QUERY.GET_AUTHENTICATION_QUERY);

  const authPayload: GetAuthPayload = {
    token: sessionStorage.getItem('token'),
  };

  useEffect(() => {
    const asyncGetAuth = async () => {
      await dispatch(setIsPending(true));
      const res = await getAuthentication({ variables: authPayload });
      if (res.data.getAuthentication) {
        await dispatch(setIsAuthenticated(true));
      }
      await dispatch(setIsPending(false));
    };
    asyncGetAuth();
  }, []);

  if (!isAuthenticated && isPending) {
    return <LoadingForm />;
  } else {
    return isAuthenticated ? (
      <Router>
        <div>
          <Routes>
            <Route path='*' element={<Navigate to='/profile' />} />
            <Route path='/profile' element={<ProfileContainer />} />
          </Routes>
        </div>
      </Router>
    ) : (
      <Router>
        <div>
          <Routes>
            <Route path='*' element={<Navigate to='/login' />} />
            <Route path='/login' element={<LoginContainer />} />
            <Route path='/signup' element={<SignUpContainer />} />
          </Routes>
        </div>
      </Router>
    );
  }
};

export default App;
