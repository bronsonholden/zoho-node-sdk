const async = require('async');
const request = require('request');
const _ = require('lodash');
const organization = require('./organization');
const handle = require('./handle');

function support(emailId, authtoken, callback) {
  async.waterfall([
    (callback) => {
      request.get({
        baseUrl: 'https://desk.zoho.com',
        uri: '/api/v1/organizations',
        headers: {
          'Authorization': `Zoho-authtoken ${authtoken}`
        }
      }, (err, res, body) => {
        handle(err, res, body, callback);
      });
    },
    (json, callback) => {
      callback(null, _.zipObject(json.data.map(org => org.companyName), json.data));
    },
    (orgs, callback) => {
      callback(null, {
        organization: (orgName, callback) => {
          if (!orgs.hasOwnProperty(orgName)) {
            return callback(new Error(`Organization ${orgName} does not exist in account ${emailId}`));
          } else {
            return organization(emailId, authtoken, orgs[orgName].id, callback);
          }
        },
        tickets: (orgName, callback) => {
          if (!orgs.hasOwnProperty(orgName)) {
            return callback(new Error(`Organization ${orgName} does not exist in account ${emailId}`));
          }

          organization(emailId, authtoken, orgName, (err, org) => {
            if (err) {
              return callback(err);
            }

            org.tickets(callback);
          });
        }
      });
    }
  ], (err, support) => {
    if (err) {
      callback(err);
    }

    callback(null, support);
  });
}

module.exports = support;
