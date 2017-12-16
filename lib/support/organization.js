const agents = require('./agents');
const tickets = require('./tickets');

function organization(email_id, authtoken, orgId, callback) {
	callback(null, {
		tickets: callback => tickets.all(email_id, authtoken, orgId, callback),
		agents: callback => agents.all(email_id, authtoken, orgId, callback)
	});
}

module.exports = organization;
