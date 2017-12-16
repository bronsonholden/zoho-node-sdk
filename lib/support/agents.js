const listall = require('./listall');

module.exports = {
	all: (email_id, authtoken, org_id, callback) => listall(email_id, authtoken, org_id, 'agents', callback)
};
