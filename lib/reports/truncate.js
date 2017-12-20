const sts = require('string-to-stream');
const request = require('request');
const async = require('async');
const csvjson = require('csvjson');
const handle = require('./handle');

// Deletes all rows from the table and adds rows from data.
function truncate(email_id, authtoken, dbname, tname, data, callback) {
	if (data.length === 0) {
		return callback(new Error('No rows to truncate'));
	}

	var csv = csvjson.toCSV(data, {
		delimiter: ',',
		wrap: false,
		headers: 'key'
	});

	console.log(csv);

	var req = request.post({
		baseUrl: 'https://reportsapi.zoho.com',
		uri: `/api/${email_id}/${dbname}/${tname}`,
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		qs: {
			'ZOHO_ACTION': 'IMPORT',
			'ZOHO_IMPORT_TYPE': 'TRUNCATEADD',
			'ZOHO_CREATE_TABLE': false,
			'ZOHO_OUTPUT_FORMAT': 'JSON',
			'ZOHO_ERROR_FORMAT': 'JSON',
			'ZOHO_API_VERSION': '1.0',
			'authtoken': authtoken,
			'ZOHO_AUTO_IDENTIFY': 'TRUE',
			'ZOHO_ON_IMPORT_ERROR': 'SETCOLUMNEMPTY',
			'ZOHO_SKIPTOP': 0,
			'ZOHO_DATE_FORMAT': 'MM/dd/yyyy HH:mm a',
			'ZOHO_FILE': 'import.csv'
		},
		multipart: [
			{
				'content-type': 'application/json',
				body: JSON.stringify({
					_attachments: {
						'import.csv': {
							follows: true,
							length: csv.length,
							content_type: 'text/csv'
						}
					}
				})
			},
			{
				body: csv
			}
		]
	}, (err, res, body) => {
		handle(err, res, body, callback);
	});
}

module.exports = truncate;
