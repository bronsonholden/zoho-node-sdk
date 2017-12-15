const async = require('async');
const request = require('request');
const database = require('./database');
const handle = require('./handle');

function reports(callback) {
	const authtoken = process.env.REPORTS_AUTHTOKEN;
	const email_id = process.env.REPORTS_EMAIL_ID;

	if (!authtoken) {
		return callback(new Error('REPORTS_AUTHTOKEN not set. Please generate a token using the gentoken tool and set it in the .env file'));
	}

	if (!email_id) {
		return callback(new Error('REPORTS_EMAIL_ID not set. Please choose a user to perform API operations as and set it in the .env file'));
	}

	async.waterfall([
		(callback) => {
			request.get({
				baseUrl: 'https://reportsapi.zoho.com',
				uri: `/api/${email_id}`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				qs: {
					'ZOHO_ACTION': 'DATABASEMETADATA',
					'ZOHO_METADATA': 'ZOHO_CATALOG_LIST',
					'ZOHO_API_VERSION': '1.0',
					'ZOHO_OUTPUT_FORMAT': 'JSON',
					'ZOHO_ERROR_FORMAT': 'JSON',
					'authtoken': authtoken
				}
			}, (err, res, body) => {
				handle(err, res, body, callback);
			});
		},
		(result, callback) => {
			callback(null, result.map(row => row.tableCat));
		},
		(dbnames, callback) => {
			// Return reports context
			callback(null, {
				// Get list of databases in the account
				databases: callback => callback(null, dbnames),
				// Get database
				database: (dbname, callback) => {
					if (dbnames.indexOf(dbname) > 0) {
						return database(email_id, authtoken, dbname, callback);
					} else {
						return callback(new Error(`Database ${dbname} does not exist in account ${email_id}`));
					}
				},
				// Quick access to table
				table: (dbname, tname, callback) => {
					if (dbnames.indexOf(dbname) < 0) {
						return callback(new Error(`Database ${dbname} does not exist in account ${email_id}`));
					}

					database(email_id, authtoken, dbname, (err, db) => {
						if (err) {
							return callback(err);
						}

						db.table(tname, (err, t) => {
							if (err) {
								return callback(err);
							}

							callback(null, t);
						});
					});
				}
			});
		}
	], (err, reports) => {
		if (err) {
			return callback(err);
		}

		callback(null, reports);
	});
}

module.exports = reports;
