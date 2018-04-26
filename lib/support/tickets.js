const listall = require('./listall');

module.exports = {
  all: (emailId, authtoken, orgId, callback) => listall(emailId, authtoken, orgId, 'tickets', callback)
};
