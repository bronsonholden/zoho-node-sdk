const async = require('async');
const token = require('../lib/token');

require('dotenv').config();

const apps = [
	{
		email_id: process.env.REPORTS_EMAIL_ID,
		password: process.env.REPORTS_PASSWORD,
		scope: 'ZohoReports/reportsapi'
	},
	{
		email_id: process.env.SUPPORT_EMAIL_ID,
		password: process.env.SUPPORT_PASSWORD,
		scope: 'ZohoSupport/supportapi'
	}
];

async.each(apps, (item, callback) => {
	if (!item.scope) {
		console.log('Invalid scope');
		return callback();
	}

	if (!item.email_id) {
		console.log(`Missing EMAIL_ID for scope ${item.scope}`)
		return callback();
	}

	if (!item.password) {
		console.log(`Missing PASSWORD for scope ${item.scope}`);
		return callback();
	}

	token(item.email_id, item.password, item.scope, (err, token) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`Your ${item.scope} auth token: ${token}`);
		}

		callback();
	});
}, (err) => {
});
