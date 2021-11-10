//import sync from 'ol-hashed';
console.log('In main_1view.js ');

var eo_layers = $('#my-attributes').data('eo-layers');
console.log('EO LAYERS: ', eo_layers);
var eo_geoserver_url = $('#my-attributes').data('eo-geoserver-url');
console.log('EO GEOSERVER URL: ', eo_geoserver_url);
var eo_time = $('#my-attributes').data('eo-time');
console.log('EO TIME: ', eo_time);

eo_layers_test = {'LAYERS': eo_layers};
if (eo_layers.includes('emodis')) {
	eo_layers_test = {'LAYERS': eo_layers, 'TIME':geoe5_time};
	console.log('EMODIS time:', geoe5_time);
}

var map_view = new ol.View({
  center: ol.proj.fromLonLat([41, 0]),
  zoom: 5.5
})

var map_eo = new ol.Map({
  target: 'map_eo',
  layers: [
	new ol.layer.Tile({
	  source: new ol.source.OSM(),
	}),
	new ol.layer.Image({
	  source: new ol.source.ImageWMS({
		url: eo_geoserver_url,
		params: eo_layers_test,
		serverType: 'geoserver',
	  }),
	}), 
	view: map_view
  ],
});

//=========================================


var forecast_sld_file = $('#my-attributes1').data('forecast-sld');
console.log('Forecast SLD: ', forecast_sld_file);
document.getElementById("forecast_message").innerHTML = "{{ forecast_sld_file }}";
document.getElementById("eo_message").innerHTML = "{{ eo_layers }}";

var map_fcast = new ol.Map({
  target: 'map_fcast',
  layers: [
	new ol.layer.Tile({
	  source: new ol.source.OSM(),
	}),
	new ol.layer.Image({
	  source: new ol.source.ImageWMS({
		url: 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver/wms',
		params: {'SLD': forecast_sld_file },
		serverType: 'geoserver',
	  }),
	}), 
  ],
  view: map_view
  })
});
	
				
//map_eo.bindTo('view', map_fcast);
///sync(map_eo);
