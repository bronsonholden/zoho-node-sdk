const async = require('async');
const token = require('../lib/token');

if (process.argv.length < 4) {
  console.log('Usage: node tool/gentoken.js <emailId> <password>');
  process.exit(1);
}

const emailId = process.argv[2];
const password = process.argv[3];
const scopes = [
  'ZohoReports/reportsapi',
  'ZohoSupport/supportapi'
];

async.each(scopes, (scope, callback) => {
  token(emailId, password, scope, (err, token) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Your ${scope} auth token: ${token}`);
    }

    callback();
  });
}, (err) => {
  console.log(err.message);
});
