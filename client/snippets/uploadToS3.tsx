import axios from 'axios';

const uploadToS3 = async (file, signedRequest) => {
	const options = {
		headers: {
			'Content-Type': file.type,
		},
	};
	const res = await axios.put(signedRequest, file, options);
	return res;
};

export default uploadToS3;
