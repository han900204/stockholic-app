import React from 'react';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {} from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';
import Typography from '@mui/material/Typography';
import ForumTable from '../components/ForumTable';
import CreateForumModal from '../components/CreateForumModal';

const ForumListContainer = () => {
  const investorId = useSelector(
    (state: RootState) => state.investor.investorId
  );

  const { loading, error, data } = useQuery(GQL_QUERY.GET_FORUMS_QUERY);

  if (loading) return <LoadingForm />;

  return (
    <>
      <Typography variant='h3' component='div' gutterBottom>
        Investor Forum
      </Typography>
      <CreateForumModal investorId={investorId} />

      <ForumTable data={data} />
    </>
  );
};

export default ForumListContainer;
