const async = require('async');
const request = require('request');
const handle = require('./handle');
const table = require('./table');

function database(emailId, authtoken, dbname, callback) {
  async.waterfall([
    (callback) => {
      request.get({
        baseUrl: 'https://reportsapi.zoho.com',
        uri: `/api/${emailId}/${dbname}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        qs: {
          'ZOHO_ACTION': 'DATABASEMETADATA',
          'ZOHO_METADATA': 'ZOHO_CATALOG_INFO',
          'ZOHO_API_VERSION': '1.0',
          'ZOHO_OUTPUT_FORMAT': 'JSON',
          'ZOHO_ERROR_FORMAT': 'JSON',
          'authtoken': authtoken
        }
      }, (err, res, body) => {
        handle(err, res, body, callback);
      });
    },
    (result, callback) => {
      if (!result.hasOwnProperty('views')) {
        return callback(new Error('Invalid JSON response'));
      }

      callback(null, result.views);
    },
    (views, callback) => {
      // Filter out views (graphs, etc)
      callback(null, views.filter(t => t.tableType === 'TABLE'));
    },
    (tables, callback) => {
      // Get array of table names only
      callback(null, tables, tables.map(t => t.tableName));
    },
    (tables, tnames, callback) => {
      // Create dictionary of table names and an array of column names for that table
      callback(null, tnames, tables.reduce((obj, t) => {
        obj[t.tableName] = t.columns.filter(c => c.columnName !== '__ZDBID').map(c => c.columnName);

        return obj;
      }, {}));
    },
    (tnames, columns, callback) => {
      // Return database context
      callback(null, {
        // Get table
        table: (tname, callback) => {
          if (tnames.indexOf(tname) > 0) {
            return table(emailId, authtoken, dbname, tname, columns[tname], callback);
          } else {
            return callback(new Error(`Table ${tname} does not exist in database ${dbname}`));
          }
        }
      });
    }
  ], (err, db) => {
    if (err) {
      return callback(err);
    }

    callback(null, db);
  });
}

module.exports = database;
