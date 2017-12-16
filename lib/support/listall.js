const async = require('async');
const request = require('request');
const handle = require('./handle');

function listall(email_id, authtoken, org_id, entity, callback) {
	const parallel = 20;
	var tickets = [];
	var arr = [];

	for (var i = 0; i < parallel; ++i) {
		arr[i] = i;
	}

	async.eachLimit(arr, parallel, (n, callback) => {
		var from = n * 99;
		var status = 200;

		n += parallel;

		async.until(() => {
			return status !== 200;
		}, (callback) => {
			request.get({
				baseUrl: 'https://desk.zoho.com',
				uri: '/api/v1/' + entity,
				headers: {
					'Authorization': `Zoho-authtoken ${authtoken}`,
					'orgId': org_id
				},
				qs: {
					from: from,
					limit: 99
				}
			}, (err, res, body) => {
				status = res.statusCode;

				if (res.statusCode === 204) {
					return callback();
				} else if (res.statusCode === 200) {
					var json = JSON.parse(body);

					if (!json.hasOwnProperty('data')) {
						return callback(new Error('Invalid JSON response'));
					}

					from += 99 * parallel;
					tickets = tickets.concat(json.data);

					callback();
				} else {
					// Let handler deal with unexpected response
					handle(err, res, body, callback);
				}
			});
		}, (err) => {
			callback(err);
		});
	}, (err) => {
		if (err) {
			return callback(err);
		}

		callback(null, tickets);
	});
}

module.exports = listall;
