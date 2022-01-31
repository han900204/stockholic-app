import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {} from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';

const ForumContainer = () => {
  const investorId = useSelector(
    (state: RootState) => state.investor.investorId
  );

  const { loading, error, data } = useQuery(GQL_QUERY.GET_FORUMS_QUERY);

  if (loading) return <LoadingForm />;

  console.log(data);

  return <div>Hello Forum</div>;
};

export default ForumContainer;
