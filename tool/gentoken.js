const reports = require('../lib/reports/token');

require('dotenv').config();

reports(process.env.REPORTS_EMAIL_ID, process.env.REPORTS_PASSWORD, (err, token) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Your Zoho Reports auth token: ' + token);
	}
});
