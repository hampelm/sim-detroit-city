$(function(){
	var APIURL = 'https://matth-dev.herokuapp.com/api';
  var map = L.map('map').setView([42.42, -83.02 ], 17);

  baseLayer = L.tileLayer('http://a.tiles.mapbox.com/v3/matth.map-zmpggdzn/{z}/{x}/{y}.png');
  map.addLayer(baseLayer);

  var processFeatures = function(features) {
  	for (var i = 0; i < features.length; i++) {
  		console.log(features[i]);
  	};
  }

  var api = {};

  api.getGeoBoundsObjectsURL = function(bbox) {
    return APIURL + '/parcels.geojson?bbox=' + bbox.join(',');
  };

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


  var bounds = map.getBounds();
  console.log("Bounds", bounds);
  var urlBounds = [[bounds.getWest(), bounds.getSouth()], [bounds.getEast(), bounds.getNorth()]];
  api.getObjectsInBBox(urlBounds, {}, function(error, data){
  	console.log(error, data);
  	var objs = L.geoJson(data).addTo(map);
  	objs.on('click', function(event) {
  		console.log(event);
  		event.layer.setStyle({
  			color: 'red'
  		});
  	});
  });



});
