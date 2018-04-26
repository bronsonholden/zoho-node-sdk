const addrow = require('./addrow');
const truncate = require('./truncate');

function table(emailId, authtoken, dbname, tname, columns, callback) {
  // Return table context
  callback(null, {
    addrow: (data, callback) => {
      for (var key in data) {
        if (columns.indexOf(key) < 0) {
          return callback(new Error(`Column ${key} does not exist in table ${tname}`));
        }
      }

      return addrow(emailId, authtoken, dbname, tname, data, callback);
    },
    truncate: (data, callback) => {
      return truncate(emailId, authtoken, dbname, tname, data, callback);
    }
  });
}

module.exports = table;
