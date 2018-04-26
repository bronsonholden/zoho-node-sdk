Zoho Node.js SDK
================

[![NPM](https://nodei.co/npm/zoho-node-sdk.png)](https://nodei.co/npm/zoho-node-sdk/)

[![dependencies Status](https://david-dm.org/paulholden2/zoho-node-sdk/status.svg)](https://david-dm.org/paulholden2/zoho-node-sdk)

A simple SDK for using the REST API for Zoho apps. Any inconsistencies in
Zoho's various APIs are abstracted away, and a consistent, easy-to-use
interface is presented in this SDK.

Examples
========

## Support

To connect:

```javascript
const zoho = require('zoho-node-sdk');

zoho.support('email@website.com', 'authtoken_here', (err, support) => {

});
```

To list tickets:

```javascript
zoho.support('email@website.com', 'authtoken_here', (err, support) => {
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

zoho.reports('email@website.com', 'authtoken_here', (err, reports) => {
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

## Token Generation

Simple tool to generate auth tokens for use with the API for each respective
Zoho app. See [here](https://www.zoho.com/recruit/helpnew/job-boards-resumes/resume-management/resume-extractor/resume-extractor-delete-auth-token.html) for information on deleting auth tokens to
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
Your ZohoReports/reportsapi auth token: 8d071f5ae72592dd4c6f45414c82c0d7
Your ZohoSupport/supportapi auth token: 895ef8b3c02ab0b2d99d1b028bd78173

```
