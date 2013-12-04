var api = {};

api.APIURL = 'https://matth-dev.herokuapp.com/api',

api.getGeoBoundsObjectsURL = function(bbox) {
  return api.APIURL + '/parcels.geojson?bbox=' + bbox.join(',');
}

// Query the GeoAPI for features in the given bounding box
//
// @param {Object} bbox A bounding box specified as an array of coordinates:
// [[west, south], [east, north]]
// @param {Object} options Not currently used; here for consistency
// @param {Function} callback Expects a list of features & attributes
// @param {Function} callback With two parameters, error and results, a
// GeoJSON FeatureCollection
api.getObjectsInBBox = function(bbox, options, callback) {
  // Given the bounds, generate a URL to ge the responses from the API.
  var url = api.getGeoBoundsObjectsURL(bbox);

  // Get geo objects from the API. Don't force non-caching on IE, since these
  // should rarely change and could be requested multiple times in a session.
  // If we're in offline mode, don't wait around forever for base layer
  // objects.
  var timeout = 0;
  // if (!api.online) {
  //   timeout = 10000;
  // }
  // Give the callback the responses.
  $.ajax({
    url: url,
    dataType: 'json',
    type: 'GET',
    timeout: timeout
  })
  .done(function (data) {
  	console.log("DONEEEE");
    if (data) {
      callback(null, data);
    } else {
      callback({
        type: 'APIError',
        message: 'Got no data from the LocalData geo endpoint'
      });
    }
  })
  .fail(function (error) {
    console.warn('Failed to fetch objects in a bounding box: ' + error.name);
    console.warn(error.message);
    callback({
      type: 'APIError',
      message: 'Error fetching data from the LocalData geo endpoint'
    });
  });
};
