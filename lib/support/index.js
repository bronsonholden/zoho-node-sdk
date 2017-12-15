const async = require('async');
const request = require('request');
const _ = require('lodash');
const organization = require('./organization');
const handle = require('./handle');

function support(callback) {
	const authtoken = process.env.SUPPORT_AUTHTOKEN;
	const email_id = process.env.SUPPORT_EMAIL_ID;

	if (!authtoken) {
		return callback(new Error('SUPPORT_AUTHTOKEN not set. Please generate a token using the gentoken tool and set it in the .env file'));
	}

	if (!email_id) {
		return callback(new Error('SUPPORT_EMAIL_ID not set. Please choose a user to perform API operations as and set it in the .env file'));
	}

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
				organization: (orgname, callback) => {
					if (!orgs.hasOwnProperty(orgname)) {
						return callback(new Error(`Organization ${orgname} does not exist in account ${email_id}`));
					} else {
						return organization(email_id, authtoken, orgs[orgname].id, callback);
					}
				},
				tickets: (orgname, callback) => {
					if (!orgs.hasOwnProperty(orgname)) {
						return callback(new Error(`Organization ${orgname} does not exist in account ${email_id}`));
					}

					organization(email_id, authtoken, orgname, (err, org) => {
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
