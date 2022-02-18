const cron = require('node-cron');
const { PythonShell } = require('python-shell');
const path = require('path');

const runPy = () => {
	let options = {
		mode: 'text',
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: path.resolve(__dirname, '../ml/'),
		args: [], //An argument which can be accessed in the script using sys.argv[1]
	};

	PythonShell.run('run.py', options, function (err, result) {
		if (err) throw err;
		// result is an array consisting of messages collected
		// during execution of script.
		console.log(result.toString());
	});
};

module.exports = () => {
	console.log('Running python scripts...');
	cron.schedule('* * * * *', () => {
		runPy();
	});
};
