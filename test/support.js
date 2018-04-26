const async = require('async');
const zoho = require('../');

async.waterfall([
  (callback) => zoho.support(process.env.ZOHO_SUPPORT_EMAIL_ID, process.env.ZOHO_SUPPORT_AUTHTOKEN, callback),
  (support, callback) => support.organization('Stria', callback),
  (org, callback) => {
    org.tickets((err, tickets) => {
      callback(err, org);
    });
  },
  (org, callback) => {
    org.agents((err, agents) => {
      callback(err, org);
    });
  },
  (org, callback) => callback()
], (err, tickets) => {
  if (err) {
    return console.log(err);
  }

  console.log('done');
});
