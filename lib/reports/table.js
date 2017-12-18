const async = require('async');
const request = require('request');
const handle = require('./handle');
const addrow = require('./addrow');
const truncate = require('./truncate');

function table(email_id, authtoken, dbname, tname, columns, callback) {
	// Return table context
	callback(null, {
		addrow: (data, callback) => {
			for (var key in data) {
				if (columns.indexOf(key) < 0) {
					return callback(new Error(`Column ${col} does not exist in table ${tname}`));
				}
			}

			return addrow(email_id, authtoken, dbname, tname, data, callback);
		},
		truncate: (data, callback) => {
			return truncate(email_id, authtoken, dbname, tname, data, callback);
		}
	});
}

module.exports = table;
