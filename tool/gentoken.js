const async = require('async');
const token = require('../lib/token');

if (process.argv.length < 4) {
	return console.log('Usage: node tool/gentoken.js <email_id> <password>');
}

const email_id = process.argv[2];
const password = process.argv[3];
const scopes = [
	'ZohoReports/reportsapi',
	'ZohoSupport/supportapi'
];

async.each(scopes, (scope, callback) => {
	token(email_id, password, scope, (err, token) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`Your ${scope} auth token: ${token}`);
		}

		callback();
	});
}, (err) => {
});
