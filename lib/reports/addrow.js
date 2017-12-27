const request = require('request');
const handle = require('./handle');
const _ = require('lodash');

function addrow(email_id, authtoken, dbname, tname, data, callback) {
	var qs = {
		'ZOHO_ACTION': 'ADDROW',
		'ZOHO_API_VERSION': '1.0',
		'ZOHO_OUTPUT_FORMAT': 'JSON',
		'ZOHO_ERROR_FORMAT': 'JSON',
		'authtoken': authtoken
	};

	// Put column=value in query string
	for (var key in data) {
		qs[key] = data[key];
	}

	request.get({
		baseUrl: 'https://reportsapi.zoho.com',
		uri: `/api/${email_id}/${dbname}/${tname}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		qs: qs
	}, (err, res, body) => {
		handle(err, res, body, (err, result) => {
			if (err) {
				return callback(err);
			}

			callback(null, result.rows.map(row => _.zipObject(result.column_order, row)));
		});
	});
}

module.exports = addrow;
