// Diagnose response from the Zoho Support API

function handle(err, res, body, callback) {
	if (err) {
		return callback(err);
	}

	switch (res.statusCode) {
	case 200:
	case 201:
	case 204:
		break;
	default:
		return callback(new Error(`${res.statusCode} ${body}`));
	}

	var json = JSON.parse(body.replace(/\\'/g, '\''));

	return callback(null, json);
}

module.exports = handle;
