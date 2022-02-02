import React from 'react';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import { GetForumPayload, GetForumResponse } from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';
import { useParams } from 'react-router-dom';

const ForumContainer = () => {
  const params = useParams();
  const investorId = useSelector(
    (state: RootState) => state.investor.investorId
  );

  const { loading, error, data } = useQuery<GetForumResponse, GetForumPayload>(
    GQL_QUERY.GET_FORUM_QUERY,
    { variables: { id: Number(params.id) } }
  );

  if (loading) return <LoadingForm />;

  return <div>Forum Detail</div>;
};

export default ForumContainer;
