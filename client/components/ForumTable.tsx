import React from 'react';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {} from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';
import SimpleTable from '../components/styleComponents/SimpleTable';
import { ForumColumn, ForumData } from '../constants/STYLE_INTERFACE';
import Typography from '@mui/material/Typography';

const ForumTable = ({ data }) => {
  const investorId = useSelector(
    (state: RootState) => state.investor.investorId
  );

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

  return <SimpleTable columns={columns} rows={rows} />;
};

export default ForumTable;
