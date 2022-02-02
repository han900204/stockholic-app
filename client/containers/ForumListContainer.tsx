import React from 'react';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {} from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';
import ForumTable from '../components/ForumTable';
import CreateForumModal from '../components/CreateForumModal';
import Subheading from '../components/styleComponents/Subheading';

const ForumListContainer = () => {
  const investorId = useSelector(
    (state: RootState) => state.investor.investorId
  );

  const { loading, error, data } = useQuery(GQL_QUERY.GET_FORUMS_QUERY);

  if (loading) return <LoadingForm />;

  return (
    <>
      <Subheading title='Investor Forum' />
      <CreateForumModal investorId={investorId} />

      <ForumTable data={data} />
    </>
  );
};

export default ForumListContainer;
