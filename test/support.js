const async = require('async');
const zoho = require('../');
const fs = require('fs');

async.waterfall([
	(callback) => zoho.support(callback),
	(support, callback) => support.organization('Stria', callback),
	(org, callback) => org.tickets(callback)
], (err, tickets) => {
	if (err) {
		return console.log(err);
	}

	console.log('done');
});
