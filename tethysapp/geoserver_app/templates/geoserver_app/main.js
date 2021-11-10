//import sync from 'ol-hashed';

console.log('EO LAYERS: ', eo_layers);
console.log('EO GEOSERVER URL: ', eo_geoserver_url);
console.log('EO TIME: ', geoe5_time);

eo_layers_test = {'LAYERS': eo_layers};
if (eo_layers.includes('emodis')) {
	eo_layers_test = {'LAYERS': eo_layers, 'TIME':geoe5_time};
	console.log('EMODIS time:', geoe5_time);
}

var eo_map = new ol.Map({
  target: 'map_eo',
  layers: [
	new ol.layer.Tile({
	  source: new ol.source.OSM(),
	}),
	new ol.layer.Image({
	  source: new ol.source.ImageWMS({
		url: eo_geoserver_url,
		//url: 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver/wms',
		params: eo_layers_test,
		//params: {'LAYERS': eo_layers},
		//url: 'https://dmsdata.cr.usgs.gov/geoserver/wms',
		//params: {'LAYERS': eo_layers, 'TIME':'2020-08-01', 'jsonLayerId':'emodisndvic6v2_africa_dekad_data', 'STYLES':'fews_emodis_dekad_data_raster_ngviewer' },
		serverType: 'geoserver',
	  }),
	}), 
  ],
  view: new ol.View({
	center: ol.proj.fromLonLat([41, 0]),
	zoom: 5.5
  })
});


sync(map_eo);
