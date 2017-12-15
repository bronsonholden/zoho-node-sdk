Zoho Node.js SDK
================

A simple SDK for using the REST API for Zoho apps. Any inconsistencies in
Zoho's various APIs are abstracted away, and a consistent, easy-to-use
interface is presented in this SDK.

Examples
========

## Support

To connect:

```javascript
const zoho = require('zoho-node-sdk');

zoho.support((err, support) => {

});
```

To list tickets:

```javascript
zoho.support((err, support) => {
	support.tickets('MyOrg', (err, tickets) => {
		console.log(tickets);
	});

	// Or

	support.organization('MyOrg', (err, org) => {
		org.tickets((err, tickets) => {
			console.log(tickets);
		});
	});
});
```

## Reports

To connect and add a row to a table:

```javascript
const zoho = require('zoho-node-sdk');

zoho.reports((err, reports) => {
	reports.database('MyDB', (err, db) => {
		db.table('MyTable', (err, t) => {
			t.addrow({
				'MyCol': 'MyVal'
			}, (err, rows) => {
				console.log('done');
			});
		});
	});

	// Or

	reports.table('MyDB', 'MyTable', (err, t) => {
		t.addrow({
			'MyCol': 'MyVal'
		}, (err, rows) => {
			console.log('done');
		});
	});
});
```

## .env

The `.env` file stores your particular credentials, tokens, and other sensitive
information required to use the SDK. It must be located in the root directory
of your project. You should ***never*** commit this file or any information in
it to a publicly-visible repository. The following variables should be set:

| Variable Name | Description |
|---------------|-------------|
| REPORTS_EMAIL_ID | Login name (email address) of the user to operate as with the Zoho Reports API. |
| REPORTS_PASSWORD | The password for the user set in REPORTS_EMAIL_ID, or if using TFA, an application specific password. See [here](https://www.zoho.com.cn/mail/help/adminconsole/two-factor-authentication.html#alink5) for more information. |
| REPORTS_AUTHTOKEN | The auth token to use when operating with the Zoho Reports API. |
| SUPPORT_EMAIL_ID | Login name (email address) of the user to operate as with the Zoho Support API. |
| SUPPORT_PASSWORD | The password for the user set in SUPPORT_EMAIL_ID, or if using TFA, an application specific password. See [here](https://www.zoho.com.cn/mail/help/adminconsole/two-factor-authentication.html#alink5) for more information. |
| SUPPORT_AUTHTOKEN | The auth token to use when operating with the Zoho Support API. |

Though not recommended, you can also set these environment variables for your
entire user or computer.

## Token Generation

Simple tool to generate auth tokens for use with the API for each respective
Zoho app. Place the resulting auth token in the appropriate environment
variable in your `.env` file. See [here](https://www.zoho.com/recruit/helpnew/job-boards-resumes/resume-management/resume-extractor/resume-extractor-delete-auth-token.html) for information on deleting auth tokens to
revoke access to your apps.

Note: It is possible to generate a single authtoken for multiple scopes, if
you wish to use multiple Zoho apps under a single user. This is currently not
directly supported by the token generation tool, but you can easily modify the
script to use whatever scope(s) you want.

```javascript
node tool/gentoken.js
```

Example output:

```
Your Zoho Reports auth token: 8d071f5ae72592dd4c6f45414c82c0d7
```
