const zoho = require('./');
const async = require('async');

async.waterfall([
	(callback) => {
		zoho.reports((err, reports) => {
			if (err) {
				return callback(err);
			}

			callback(null, reports);
		});
	},
	(reports, callback) => {
		reports.database('Test', (err, db) => {
			if (err) {
				return callback(err);
			}

			callback(null, db);
		});
	},
	(db, callback) => {
		db.table('SpringCM Backup History', (err, t) => {
			if (err) {
				return callback(err);
			}

			callback(null, t);
		});
	},
	(t, callback) => {
		t.addrow({
			'Backup Date': '12/14/2017',
			'Account Name': 'Paul Holden UAT',
			'Account ID': '12345'
		}, (err, row) => {
			if (err) {
				return callback(err);
			}

			console.log(row);
			callback();
		})
	}
], (err) => {
	if (err) {
		console.log(err);
	}
});

async.waterfall([
	(callback) => {
		zoho.reports((err, reports) => {
			if (err) {
				return callback(err);
			}

			callback(null, reports);
		});
	},
	(reports, callback) => {
		reports.table('Test', 'SpringCM Backup History', (err, t) => {
			if (err) {
				return callback(err);
			}

			callback(null, t);
		});
	},
	(t, callback) => {
		t.addrow({
			'Backup Date': '12/14/2017',
			'Account Name': 'Paul Holden UAT',
			'Account ID': '12345'
		}, (err, row) => {
			if (err) {
				return callback(err);
			}

			console.log(row);
			callback();
		})
	}
], (err) => {
	if (err) {
		console.log(err);
	}
});
