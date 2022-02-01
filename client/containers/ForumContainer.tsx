import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {} from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';
import SimpleTable from '../components/styleComponents/SimpleTable';
import { ForumColumn, ForumData } from '../constants/STYLE_INTERFACE';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ForumContainer = () => {
  const investorId = useSelector(
    (state: RootState) => state.investor.investorId
  );

  const { loading, error, data } = useQuery(GQL_QUERY.GET_FORUMS_QUERY);

  if (loading) return <LoadingForm />;

  const columns: readonly ForumColumn[] = [
    { id: 'name', label: 'Name', minWidth: 300 },
    {
      id: 'nick_name',
      label: 'Posted By',
      minWidth: 150,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'date_created',
      label: 'Created at',
      minWidth: 150,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
  ];

  function createData(
    name: string,
    nick_name: string,
    date_created: string
  ): ForumData {
    return { name, nick_name, date_created };
  }

  const rows = data.getForums.reduce((row, forum) => {
    row.push(
      createData(
        forum.name,
        forum.nick_name,
        new Date(forum.date_created).toISOString().split('T')[0]
      )
    );
    return row;
  }, []);

  return (
    <>
      <Typography variant='h3' component='div' gutterBottom>
        Investor Forum
      </Typography>
      <SimpleTable columns={columns} rows={rows} />
    </>
  );
};

export default ForumContainer;
