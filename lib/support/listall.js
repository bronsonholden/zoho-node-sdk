const async = require('async');
const request = require('request');
const handle = require('./handle');

// Generic function to get all objects of varying types (e.g. tickets)
function listall(emailId, authtoken, orgId, entity, callback) {
  // How many concurrent requests to run
  const parallel = 20;
  var objects = [];
  var arr = [];

  // Create array of page offsets
  for (var i = 0; i < parallel; ++i) {
    arr[i] = i;
  }

  // Run concurrent request chains. The entire operation works on
  // an arbitrary range of objects. This range is split into smaller
  // subranges which is assigned to each chain based on its index
  // in the set, determined by its index in <arr> (and its value).
  // Each chain runs until no content is found, after which it ends.
  // Once all chains end, all content has been retrieved and the
  // operation is complete.
  async.eachLimit(arr, parallel, (n, callback) => {
    var from = n * 99;
    var status = 200;

    n += parallel;

    async.until(() => {
      return status !== 200;
    }, (callback) => {
      request.get({
        baseUrl: 'https://desk.zoho.com',
        uri: '/api/v1/' + entity,
        headers: {
          'Authorization': `Zoho-authtoken ${authtoken}`,
          'orgId': orgId
        },
        qs: {
          from: from,
          limit: 99
        }
      }, (err, res, body) => {
        status = res.statusCode;

        if (res.statusCode === 204) {
          return callback();
        } else if (res.statusCode === 200) {
          var json = JSON.parse(body);

          if (!json.hasOwnProperty('data')) {
            return callback(new Error('Invalid JSON response'));
          }

          // Move to next subrange
          from += 99 * parallel;
          objects = objects.concat(json.data);

          callback();
        } else {
          // Let handler deal with unexpected response
          handle(err, res, body, callback);
        }
      });
    }, (err) => {
      callback(err);
    });
  }, (err) => {
    if (err) {
      return callback(err);
    }

    callback(null, objects);
  });
}

module.exports = listall;
