
//import sync from 'ol-hashed';
//import ImageWMS from 'ol/source/ImageWMS';

console.log('In main2.js forecast_viewer...');

var eo_geoserver_url = $('#my-attributes').data('eo-geoserver-url');
//console.log('EO GEOSERVER URL: ', eo_geoserver_url);

var eo_layers = $('#my-attributes').data('eo-layers');
console.log('EO LAYERS: ', eo_layers);

var eo_time = $('#my-attributes').data('eo-time');
console.log('EO TIME: ', eo_time);

var fcast_shapefile = $('#my-attributes').data('forecast-shapefile');
console.log('FORECAST-SHAPEFILE: ', fcast_shapefile);

var fcast_property = $('#my-attributes').data('forecast-property');
console.log('FORECAST-PROPERTY: ', fcast_property);

var geoserver_url = 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver';

var eo_params = {'LAYERS': eo_layers}
if (eo_time != undefined) {
	eo_params.TIME = eo_time;
}
console.log('EO_PARAMS: ', eo_params);

//var sld = featureforecast_sld_file.split('/');
//console.log('SLD: ', sld[sld.length-1]);
//sld = sld[sld.length-1]

var wms_layer = eo_layers.split(',');
console.log('WMS LAYER: ', wms_layer);
wms_layer = wms_layer[0];
console.log('WMS LAYER: ', wms_layer);

document.getElementById("eo_message").innerHTML = wms_layer;

//eo_layers_test = {'LAYERS': eo_layers};
//if (eo_layers.includes('emodis')) {
//	eo_layers_test = {'LAYERS': eo_layers, 'TIME':geoe5_time};
//	console.log('EMODIS time:', geoe5_time);
//}

//  sessionStorage.clear(); //*** resets storage ***

var mv_center_lon, mv_center_lat, mv_zoom;
var center_lon, center_lat, zoom;


mv_center_lon = sessionStorage.getItem("map_view_center_lon");
mv_center_lat = sessionStorage.getItem("map_view_center_lat");
mv_zoom = sessionStorage.getItem("map_view_zoom");

console.log('saved map_view: ', mv_center_lon, mv_center_lat, mv_zoom);

if (mv_center_lon === null) {
	console.log('Initializing map_view...');
	center_lon = 23.5;
	center_lat = 3.0;
	zoom = 3;
	sessionStorage.setItem("map_view_center_lon", center_lon.toString());
	sessionStorage.setItem("map_view_center_lat", center_lat.toString());
	sessionStorage.setItem("map_view_zoom", zoom.toString());
	//sessionStorage.map_view = map_view;
	mv_center_lon = center_lon;
    mv_center_lat = center_lat;
    mv_zoom = sessionStorage.getItem("map_view_zoom");
};

console.log('Restoring map_view...');
mv_center_lon = sessionStorage.getItem("map_view_center_lon");
mv_center_lat = sessionStorage.getItem("map_view_center_lat");
mv_zoom = sessionStorage.getItem("map_view_zoom");

center_lon = parseFloat(mv_center_lon);
center_lat = parseFloat(mv_center_lat);
zoom = parseFloat(mv_zoom);

var map_view = new ol.View({
	center: ol.proj.fromLonLat([center_lon, center_lat], 'EPSG:3857'),
	//center: ol.proj.fromLonLat([center_lon, center_lat]),
	zoom: zoom
});

function viewWestAfrica(evt) {
	console.log('view west Africa...');
	center_lon = 10.0;
	center_lat = 4.2;
	zoom = 5;
	sessionStorage.setItem("map_view_center_lon", center_lon.toString());
	sessionStorage.setItem("map_view_center_lat", center_lat.toString());
	sessionStorage.setItem("map_view_zoom", zoom.toString());

	map_view.setCenter(ol.proj.fromLonLat([center_lon, center_lat], 'EPSG:3857'));
	map_view.setZoom(zoom);
};


function viewSouthernAfrica(evt) {
	console.log('view west Africa...');
	center_lon = 26.5;
	center_lat = (-17.7);
	zoom = 4;
	sessionStorage.setItem("map_view_center_lon", center_lon.toString());
	sessionStorage.setItem("map_view_center_lat", center_lat.toString());
	sessionStorage.setItem("map_view_zoom", zoom.toString());

	map_view.setCenter(ol.proj.fromLonLat([center_lon, center_lat], 'EPSG:3857'));
	map_view.setZoom(zoom);
};


function viewEastAfrica(evt) {
	console.log('view west Africa...');
	center_lon = 38.5;
	center_lat = 3.7;
	zoom = 5;
	sessionStorage.setItem("map_view_center_lon", center_lon.toString());
	sessionStorage.setItem("map_view_center_lat", center_lat.toString());
	sessionStorage.setItem("map_view_zoom", zoom.toString());

	map_view.setCenter(ol.proj.fromLonLat([center_lon, center_lat], 'EPSG:3857'));
	map_view.setZoom(zoom);
};


var map_eo = new ol.Map({
  target: 'map_eo',
	controls: [],
  layers: [
	new ol.layer.Tile({
	  source: new ol.source.OSM(),
	}),
	new ol.layer.Image({
	  source: new ol.source.ImageWMS({
		url: eo_geoserver_url,
        params: eo_params,
        //params: {'LAYERS': eo_layers},
		serverType: 'geoserver',
	  }),
	}),
  ],
  view: map_view
});

//=========================================


var forecast_sld_file = $('#my-attributes').data('forecast-sld');
console.log('Forecast SLD: ', forecast_sld_file);

var forecast_property = $('#my-attributes').data('forecast-property');
document.getElementById("forecast_message").innerHTML = forecast_property;
console.log('Forecast property js: ', forecast_property);


var load_fcast = true;

// function to handle success
function success() {
	console.log('sucess...');
    var res = JSON.parse(this.responseText);
    var values = Object.keys(res.features[0].properties);
    values.sort();
    values.reverse();

    var select = document.createElement("select");
    select.name = "pets";
    select.id = "pets"

    for (const val of values)
    {
    	//console.log(val);
    	if (val != 'ADMIN0' && val != 'ADMIN1' && val != 'ADMIN2' && val != 'FNID'
    		&& val != 'COUNTRY' && val != 'SEASON' && val != 'MODEL') {

			if( val.startsWith('LOF') || val.startsWith("HIF") ) { continue; }
			if( val.startsWith('MN_10') || val.startsWith("MN_ALL") ) { continue; }

			var option = document.createElement("option");
			option.value = val;
			option.text = val;

			if( val.charAt(0) == 'F') { i_offset = 1; }

			if( val.charAt(0) == 'O') {
				var yr = val.substr(1,4);
				option.text = yr;
			};
			if( val.charAt(0) == 'F') {
				var yr = val.substr(1,4);
				if( val.length == 7 ) {
					var mo = val.substr(5, 1);
					var dek = val.substr(6,1);
				} else {
					var mo = val.substr(5, 2);
					var dek = val.substr(7,1);
				}
				option.text = yr + '-' + mo + '-' + dek;
			};

			select.appendChild(option);
		};
    }

    var label = document.createElement("label");
    label.innerHTML = "Available Dates: "
    label.htmlFor = "pets";

    document.getElementById("container").appendChild(label).appendChild(select);



    if ( ! res.features[0].properties.hasOwnProperty(fcast_property) ) {
      console.log('fcast_property: ', fcast_property);
      document.getElementById("forecast_message").innerHTML = "No data for " + fcast_property;
      document.getElementById("forecast_message").style.color = "red";
      load_fcast = false;
    };
};

// function to handle error
function error(err) {
    console.log('Request Failed', err); //error details will be in the "err" object
};

var xhr = new XMLHttpRequest(); //invoke a new instance of the XMLHttpRequest

xhr.onload = success; // call success function if request is successful
xhr.onerror = error;  // call error function if request failed
var request = geoserver_url + "/wfs?typeNames=" + fcast_shapefile + "&service=wfs&version=1.3.0&request=GetFeature&count=1&outputFormat=json";
console.log('request: ', request);
xhr.open('GET', request, true); // open a GET request
xhr.send(); // send the request to the server.


if (load_fcast) {
	var fcast_source = new ol.source.ImageWMS({
	  url: geoserver_url + '/wms',
	  params: {'SLD': forecast_sld_file},
	  serverType: 'geoserver',
	});

	var map_fcast = new ol.Map({
	  target: 'map_fcast',
		controls: [],
	  layers: [
		new ol.layer.Tile({
		  source: new ol.source.OSM(),
		}),
		new ol.layer.Image({
		  source: fcast_source,
		}),
	  ],
	  view: map_view
	});
};

// boneyard
//xhr.overrideMimeType("application/json");
//xhr.responseType = "json";
//xhr.onreadystatechange = function() {
//if (this.readyState == 4 && this.status == 200) {
//    var data = JSON.parse(this.responseText);
//    console.log('data: ', this.responseText);
//    }
//};

//let fetched = fetch("https://chc-ewx2.chc.ucsb.edu:8443/geoserver/wfs?service=wfs&version=1.3.0&request=GetFeature&typeNames=ag_monitor_maize:L_fcast_ET&count=1");
//fetched.then( { console.log('fetched: ', fetched.json()); )

//if (fetched.ok) { console.log('fetched: ', fetched.json()); }

//var allFeatures = new WMSGetFeatureInfo();
//var fcast_features = fcast_source.getFeatures();

//var fcast_features = map_fcast.getLayerGroup().getLayers();
//var source = fcast_features.getSource();
//console.log('fcast_features: ', fcast_features);

//console.log("map_view getCenter: ", map_view.getCenter());

var center_coords;

function onMoveEnd(evt) {
	//console.log("in onMoveEnd...");
	center_coords = ol.proj.transform(map_view.getCenter(), 'EPSG:3857', 'EPSG:4326');
	center_lon = center_coords[0];
	center_lat = center_coords[1];
	//console.log("map_view center: ", center_lon.toString(), center_lat.toString());
	zoom = map_view.getZoom();
	//console.log("map_view zoom: ", zoom);
	sessionStorage.setItem("map_view_center_lon", center_lon.toString());
	sessionStorage.setItem("map_view_center_lat", center_lat.toString());
	sessionStorage.setItem("map_view_zoom", zoom.toString());
	//mv_center_lon = sessionStorage.getItem("map_view_center_lon");
    //mv_center_lat = sessionStorage.getItem("map_view_center_lat");
    //mv_zoom = sessionStorage.getItem("map_view_zoom");

	//console.log('mv retrieved: ', mv_center_lon, mv_center_lat, mv_zoom);
};

map_fcast.on('moveend', onMoveEnd);


//map_fcast.on('moveend', function (evt) {
//	console.log("in moveend...");
//});

map_fcast.on('singleclick', function (evt) {

  var message = 'Doh!';

  document.getElementById("forecast_message").innerHTML = message;
  document.getElementById("forecast_message").style.color = "black";
  const viewResolution = (map_view.getResolution());
  //console.log('viewRes: ', viewResolution);
  //console.log('coords: ', evt.coordinate);
  var features = map_fcast.getFeaturesAtPixel(evt.pixel);
  if (features) {
  	  console.log('features: ', features);
  };
  const url = fcast_source.getGetFeatureInfoUrl(
  	evt.coordinate,
  	viewResolution,
  	'EPSG:3857',
  	{'INFO_FORMAT': 'application/json'}
  );
  console.log('url: ', url);
  if (url) {
  	fetch(url)
  	  .then((response) => response.text())
  	  .then((html) => {
   	  	//document.getElementById("forecast_message").innerHTML = html;
  	  	const json = JSON.parse(html);
 	  	console.log('json: ', json);
 	  	console.log('fcast_property: ', fcast_property);
 	  	if (json.features[0].properties[fcast_property] == "") {
 	  		message = "Data not available for this date";
 	  	} else if (json.features[0].properties.ADMIN2 !== "" && json.features[0].properties.ADMIN2) {
	      message = json.features[0].properties.ADMIN0 + ", " +
		  json.features[0].properties.ADMIN1 + ": " +
		  json.features[0].properties.ADMIN2 + ": " +
		  json.features[0].properties[fcast_property];
		} else {
	      message = json.features[0].properties.ADMIN0 + ", " +
		  json.features[0].properties.ADMIN1 + ": " +
		  json.features[0].properties[fcast_property];
        }
 	  	document.getElementById("forecast_message").innerHTML = message;

  	});
  }
});


// Select the node that will be observed for mutations
const targetNode = document.getElementById('app-content-wrapper');

// Options for the observer (which mutations to observe)
const config = { attributes: true };

// Optionally collect the previous class state
let showingNav = targetNode.classList.contains('show-nav');


// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
	console.log("Callback..");
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
       if (mutation.attributeName === 'class' & mutation.target.classList.contains('show-nav') != showingNav) {
          showingNav = mutation.target.classList.contains('show-nav');
          console.log("Nav pane visibility changed " + showingNav);
          //console.log("target.classList " + mutation.target.classList);

          let size = map_fcast.getSize();
          //let extent = map_fcast.calculateExtent(size);
          let div_size = document.getElementById("map_fcast").getBoundingClientRect();
          console.log('before: ', size, div_size);

          setTimeout( function() { map_fcast.updateSize();}, 500);
          setTimeout( function() { map_eo.updateSize();}, 600);
          //map_fcast.updateSize([size[0], size[1]]);
          //map_fcast.updateSize([div_size["width"], div_size["height"]]);


          map_fcast.getLayers().forEach(layer => layer.getSource().refresh());

          size = map_fcast.getSize();
          //extent = map_fcast.calculateExtent(size);
          div_size = document.getElementById("map_fcast").getBoundingClientRect();
          console.log('after: ', size, div_size)
          map_fcast.changed();
          map_eo.changed();
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);



//map_eo.bindTo('view', map_fcast);
///sync(map_eo);
