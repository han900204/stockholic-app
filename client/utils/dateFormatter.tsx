const dateFormatter = (dateStr: string) => {
	return new Date(dateStr).toISOString().split('T')[0];
};

export default dateFormatter;
