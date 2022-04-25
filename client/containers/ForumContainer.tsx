import React from 'react';
import { useQuery } from '@apollo/client';
import GQL_QUERY from '../constants/GQL_QUERY';
import {
	GetForumPayload,
	GetForumResponse,
	GetCommentsPayload,
	GetCommentsResponse,
} from '../constants/GQL_INTERFACE';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoadingForm from '../components/LoadingForm';
import { useParams } from 'react-router-dom';
import ForumForm from '../components/ForumForm';
import CommentForm from '../components/CommentForm';

const ForumContainer = () => {
	const params = useParams();

	const { investorId } = useSelector((state: RootState) => state.investor);

	const { loading, error, data } = useQuery<GetForumResponse, GetForumPayload>(
		GQL_QUERY.GET_FORUM_QUERY,
		{ variables: { id: Number(params.id) } }
	);

	const comments = useQuery<GetCommentsResponse, GetCommentsPayload>(
		GQL_QUERY.GET_COMMENTS_QUERY,
		{ variables: { forum_id: Number(params.id) } }
	);

	if (loading || comments.loading) return <LoadingForm />;

	return (
		<>
			<ForumForm data={data} investorId={investorId} />
			<CommentForm
				data={comments.data}
				investorId={investorId}
				forumId={Number(params.id)}
			/>
		</>
	);
};

export default ForumContainer;
