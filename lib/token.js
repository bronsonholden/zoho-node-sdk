const request = require('request');

function token(email_id, password, scope, callback) {
	request.post({
		baseUrl: 'https://accounts.zoho.com',
		uri: '/apiauthtoken/nb/create',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		qs: {
			'SCOPE': scope,
			'EMAIL_ID': email_id,
			'PASSWORD': password
		}
	}, (err, res, body) => {
		if (err) {
			return callback(err);
		} else {
			var details = [
				'AUTHTOKEN',
				'RESULT',
				'CAUSE'
			].reduce((obj, detail) => {
				var arr = body.match(`${detail}=(.*)`);

				if (arr) {
					if (arr.length === 0) {
						obj[detail] = null;
					} else if (arr.length === 2) {
						obj[detail] = arr[1];
					} else {
						obj[detail] = arr.slice(1);
					}
				}

				return obj;
			}, {});

			if (details['RESULT'] === 'TRUE') {
				return callback(null, details['AUTHTOKEN']);
			} else {
				if (details.hasOwnProperty('CAUSE')) {
					callback(new Error(details['CAUSE']));
				} else {
					callback(new Error('An unknown error occurred'));
				}
			}
		}
	});
}

module.exports = token;
