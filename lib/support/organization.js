const agents = require('./agents');
const tickets = require('./tickets');

function organization(emailId, authtoken, orgId, callback) {
  callback(null, {
    tickets: callback => tickets.all(emailId, authtoken, orgId, callback),
    agents: callback => agents.all(emailId, authtoken, orgId, callback)
  });
}

module.exports = organization;
