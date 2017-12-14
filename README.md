Zoho Node.js SDK
================

A simple SDK for using the REST API for Zoho apps. Currently only Reports
is supported.

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
