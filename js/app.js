$(function(){

	var app = {
		BASESTYLE: {
			color: '#ffad00',
			stroke: '#ffad00',
		},

		SELECTEDSTYLE: {
			color: '#00ad00',
			stroke: '#00ad00'
		},

		BASELAYER: 'http://a.tiles.mapbox.com/v3/matth.map-n9bps30s/{z}/{x}/{y}.png',

		LANDUSE: 'http://a.tiles.mapbox.com/v3/matth.7nb9ms4i/{z}/{x}/{y}.png',

		ZONES: {
			'residential': {
				types: ['high', 'medium', 'low'],
				details: {
					'high': {
						'image': 'foo.jpg',
						'name': 'High density',
						'description': 'High density',
						'color': 'green'
					},
					'medium': {
						'image': 'foo.jpg',
						'name': 'medium density',
						'description': 'medum density',
						'color': 'red'
					},
					'high': {
						'image': 'foo.jpg',
						'name': 'low density',
						'description': 'low density',
						'color': '#yellow'
					}
				}
			}
		},

		map: null,

		parcelsOnTheMap: {},
		selectedParcels: {},

		init: function() {
			$('#map').height($(window).height() - $('h1').height() - 40);

			map = L.map('map').setView([42.367989,-83.086338], 12);

		  baseLayer = L.tileLayer(app.BASELAYER);
		  map.addLayer(baseLayer);

		 	landuse = L.tileLayer(app.LANDUSE);
		  map.addLayer(landuse);
			// https://www.mapbox.com/v3/matth.7nb9ms4i/9/137/189.grid.json
			var utfGrid = new L.UtfGrid('https://{s}.tiles.mapbox.com/v3/matth.7nb9ms4i/{z}/{x}/{y}.grid.json?callback={cb}', {
			    resolution: 4
			});
			utfGrid.on('mouseover', function (e) {
				$('h1').text(e.data.name);
				console.log(e.data.name);
			});

			map.addLayer(utfGrid);

		  //app.getParcels();
		},

		handleParcelClickFactory: function(feature) {
			return function(event) {
				var style;
				if (app.selectedParcels[feature.id] === undefined) {
					style = app.SELECTEDSTYLE;
					app.selectedParcels[feature.id] = true;
				}else {
					style = app.BASESTYLE;
					delete app.selectedParcels[feature.id];
				}

	  		event.layer.setStyle(style);
			}
		},

		processParcels: function(error, data) {
			var options = {
				style: app.BASESTYLE,
				onEachFeature: function(feature, layer) {
					var handleParcelClick = app.handleParcelClickFactory(feature);
					layer.on('click', handleParcelClick);
				}
			};

			var objs = L.geoJson(data, options).addTo(map);
		},

		getParcels: function() {
			var bounds = map.getBounds();
		  console.log("Bounds", bounds);
		  var urlBounds = [[bounds.getWest(), bounds.getSouth()], [bounds.getEast(), bounds.getNorth()]];
		  api.getObjectsInBBox(urlBounds, {}, app.processParcels);
		}


	};


	app.init();

});
