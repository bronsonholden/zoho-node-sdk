const zoho = require('./');
const async = require('async');

async.waterfall([
	(callback) => {
		zoho.reports((err, reports) => {
			if (err) {
				return callback(err);
			}

			callback(null, reports);
		});
	},
	(reports, callback) => {
		reports.databases((err, dbnames) => {
			if (err) {
				return callback(err);
			}

			console.log(dbnames);
			callback();
		});
	}
], (err) => {
	if (err) {
		console.log(err);
	}
});
