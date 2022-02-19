import React from 'react';
import SimpleTable from '../components/styleComponents/SimpleTable';
import { ForumColumn, ForumData } from '../constants/STYLE_INTERFACE';

const ForumTable = ({ data }) => {
	const columns: readonly ForumColumn[] = [
		{ id: 'id', label: 'id', minWidth: 100 },
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
		id: number,
		name: string,
		nick_name: string,
		date_created: string
	): ForumData {
		return { id, name, nick_name, date_created };
	}

	const rows = data.getForums.reduce((row, forum) => {
		row.push(
			createData(
				forum.id,
				forum.name,
				forum.nick_name,
				new Date(forum.date_created).toISOString().split('T')[0]
			)
		);
		return row;
	}, []);

	return (
		<SimpleTable
			columns={columns}
			rows={rows}
			linkCol='name'
			linkUrl='/forum'
		/>
	);
};

export default ForumTable;
