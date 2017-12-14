// Diagnose result of a request. Assumes body is a JSON response
// from the Zoho Reports API. Converts body to a JSON object that
// is then passed to callback.
function diagnose(err, res, body, callback) {
	if (err) {
		return callback(err);
	}

	var json = JSON.parse(body.replace('\\\'', '\''));

	if (!json.hasOwnProperty('response')) {
		return callback(new Error('Invalid JSON response'));
	} else if (json.response.hasOwnProperty('error')) {
		return callback(new Error(`${json.response.error.code} ${json.response.error.message}`));
	} else if (!json.response.hasOwnProperty('result')) {
		return callback(new Error('Invalid JSON response'));
	}

	callback(null, json.response.result);
}

module.exports = diagnose;
