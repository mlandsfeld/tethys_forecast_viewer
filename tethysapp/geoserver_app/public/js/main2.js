

console.log('In main2.js forecast_viewer...');

// 1 second delay
// setTimeout(function(){
//   console.log("Executed after 1 second");
// }, 3000);

var eo_geoserver_url = $('#my-attributes').data('eo-geoserver-url');
console.log('EO GEOSERVER URL: ', eo_geoserver_url);

var eo_layers = $('#my-attributes').data('eo-layers');
console.log('EO LAYERS: ', eo_layers);

var eo_time = $('#my-attributes').data('eo-time');
console.log('EO TIME: ', eo_time);

var fcast_shapefile = $('#my-attributes').data('forecast-shapefile');
console.log('FORECAST-SHAPEFILE: ', fcast_shapefile);

var fcast_property = $('#my-attributes').data('forecast-property');
console.log('FORECAST-PROPERTY: ', fcast_property);


var geoserver_url = 'https://ewx3.chc.ucsb.edu:8443/geoserver';
//var geoserver_url = 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver';


var eo_params = {'LAYERS': eo_layers}
if (eo_time != undefined) {
	eo_params.TIME = eo_time;
}
console.log('EO_PARAMS: ', eo_params);

var wms_layers = eo_layers.split(',');
console.log('WMS LAYERS: ', wms_layers);
dataset = wms_layers[0].split(':');
console.log('dataset: ', dataset[1])
eo_message = dataset[1] + ', ' + eo_time;
console.log('EO message: ', eo_message);


document.getElementById("eo_message").innerHTML = eo_message;


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
  controls: ol.control.defaults({
    zoom: true,
    attribution: false,
    rotate: false
  }),
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

// doesn't seem to work
//window.onload = function(){
//  update_maps();
//};

var forecast_sld_file = $('#my-attributes').data('forecast-sld');
console.log('Forecast SLD: ', forecast_sld_file);

var forecast_property = $('#my-attributes').data('forecast-property');
document.getElementById("forecast_message").innerHTML = "";
console.log('Forecast property js: ', forecast_property);


var load_fcast = true;

var select = document.createElement("SELECT");
console.log("created Select...");
select.name = "dates";
select.id = "dates";

select.onchange = function() {
	console.log("in onmouseup...");
	choose_date();
}


// Fill in the Available Dates button
function success() {
	console.log('success...');
	//console.log('this.responseText: ', this.responseText);

    if( this.responseText.includes("Exception")) {
      document.getElementById("forecast_message").innerHTML = "Data does not exist for:  " + fcast_shapefile
			document.getElementById("forecast_message").style.color = "red";
    }

    var res = JSON.parse(this.responseText);

    document.getElementById("forecast_message").innerHTML = forecast_property;
    var values = Object.keys(res.features[0].properties);
    values.sort();
    values.reverse();

    //var select = document.createElement("select");
    //select.name = "dates";
    //select.id = "dates"

    //select.onselect = function() {
    //  console.log("in select...");
    //}

    for (const val of values)
    {
    	//console.log(val);
    	if (val != 'ADMIN0' && val != 'ADMIN1' && val != 'ADMIN2' && val != 'FNID'
    		&& val != 'COUNTRY' && val != 'SEASON' && val != 'MODEL' && val != 'PRODUCT'
			  && val != 'bbox') {

				if( val.startsWith('LOF') || val.startsWith("HIF") ) { continue; }
				//if( val.startsWith('MN_10') || val.startsWith("MN_ALL") ) { continue; }

				var option = document.createElement("option");
				option.value = val;
				option.text = val;

				if( val.charAt(0) == 'O') {
					var yr = val.substr(1,4);
					option.text = yr;
				};
				if( val.charAt(0) == 'F' || val.charAt(0) == 'E') {
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

				if( val.startsWith("MP_")) {
					var moDek = val.split("_");
					var mo = moDek[1];
					var dek = moDek[2];
					option.text = mo + '-' + dek;
				}

				if( val.startsWith("MN")) {
					option.text = "Mean, no dates";
				};

				select.appendChild(option);
				//console.log(option);

			};
    }

    var label = document.createElement("label");
    label.innerHTML = "Available Dates: "
    label.htmlFor = "dates";

    document.getElementById("available_dates").appendChild(label).appendChild(select);

		console.log('Selected value: ', select.value);
		console.log('fcast_property value: ', fcast_property);

		select.value = forecast_property;

    if ( ! res.features[0].properties.hasOwnProperty(fcast_property) ) {
      console.log('fcast_property: ', fcast_property);
      document.getElementById("forecast_message").innerHTML = "No data for " + fcast_property;
      document.getElementById("forecast_message").style.color = "red";
      load_fcast = false;
			console.log('load_fcast = false');
    };
};

// function to handle error
function error(err) {
	document.getElementById("forecast_message").innerHTML = "Error retrieving shapefile: " + fcast_shapefile;
  console.log('Request Failed', err); //error details will be in the "err" object
};

var xhr = new XMLHttpRequest(); //invoke a new instance of the XMLHttpRequest

xhr.onload = success; // call success function if request is successful
xhr.onerror = error;  // call error function if request failed


if (!fcast_shapefile) {
	fcast_shapefile = "ag_monitor_maize_GB:S_current_fcast_GB";
};

var request = geoserver_url + "/wfs?typeNames=" + fcast_shapefile + "&service=wfs&version=1.3.0&request=GetFeature&count=1&outputFormat=json";

console.log('request: ', request);
xhr.open('GET', request, true); // open a GET request
xhr.send(); // send the request to the server.




// -------- Display chosen feature info in...

function display_feature_info() {
	console.log('display_feature_info...', document.getElementById('forecast_layer').value);
  feature = document.getElementById('forecast_layer').value

	if (feature == "current_CI") {
		document.getElementById("feature_info").innerHTML = "<b>Current Forecast (%):</b> Current forecast expressed as percentage of 10 year mean"
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> percent of 10 Year Mean"
	}
	if (feature == "current_CI_low") {
		document.getElementById("feature_info").innerHTML = "<b>Current Forecast low (%):</b> Low interval of current forecast"
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> percent of 10 Year Mean"
	}
	if (feature == "current_CI_high") {
		document.getElementById("feature_info").innerHTML = "<b>Current Forecast high (%):</b> High interval of current forecast"
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> percent of 10 Year Mean"
	}
	if (feature == "Historic_forecast") {
		document.getElementById("feature_info").innerHTML = "<b>Historical Forecast (%):</b> Historical Yield forecast as percentage of 10 year mean"
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> percent of 10 Year Mean"
	}
	if (feature == "forecast") {
		document.getElementById("feature_info").innerHTML = "<b>Historical Yield Forecast (MT):</b> Historical Yield forecast"
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> metric tons per hectare"
	}
	if (feature == "forecast_err") {
		document.getElementById("feature_info").innerHTML = "<b>Historical Yield Forecast Error:</b> Forecast Error for a specific year and month.  Derived from historical 1 step-ahead prediction error."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> metric tons per hectare"
	}
	if (feature == "MAPE") {
		document.getElementById("feature_info").innerHTML = "<b>Historical Yield Forecast MAPE:</b> Mean Absolute Percent Error (MAPE) for month when a forecast was made.  Derived from historical 1-step ahead prediction error."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> percent (lower is better)"
	}
	if (feature == "hind") {
		document.getElementById("feature_info").innerHTML = "<b>Historical Yield Forecast Hindcast:</b> A forecast for previous year based on the current years model."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> metric tons per hectare"
	}
	if (feature == "area") {
		document.getElementById("feature_info").innerHTML = "<b>Area:</b> Observed area harvested for a given year and season."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> hectares"
	}
	if (feature == "area_mean_10yr") {
		document.getElementById("feature_info").innerHTML = "<b>Area Mean (10 years):</b> Mean area harvested over the most recent (observed) 10 years."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> hectares"
	}
	if (feature == "area_mean_all") {
		document.getElementById("feature_info").innerHTML = "<b>Area Mean (all years):</b> Mean area harvested over all observed years."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> hectares"
	}
	if (feature == "prod") {
		document.getElementById("feature_info").innerHTML = "<b>Production:</b> Observed production for a given year and season."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> metric tons"
	}
	if (feature == "prod_mean_10yr") {
		document.getElementById("feature_info").innerHTML = "<b>Production Mean (10 years):</b> Mean production over the most recent (observed) 10 years."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> metric tons"
	}
	if (feature == "prod_mean_all") {
		document.getElementById("feature_info").innerHTML = "<b>Production Mean (all years):</b> Mean production over all observed years."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> metric tons"
	}
	if (feature == "yield") {
		document.getElementById("feature_info").innerHTML = "<b>Yield:</b> Observed yield for a given year and season."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> metric tons per hectare"
	}
	if (feature == "yield_mean_10yr") {
		document.getElementById("feature_info").innerHTML = "<b>Yield Mean (10 year):</b> Mean yield over the most recent (observed) 10 years."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> metric tons per hectare"
	}
	if (feature == "yield_mean_all") {
		document.getElementById("feature_info").innerHTML = "<b>Yield Mean (all years):</b> Mean yield over all observed years."
		document.getElementById("feature_units").innerHTML = "<b>Units:</b> metric tons per hectare"
	}

};

//document.getElementById('forecast_layer').onmouseup = function() {
	//console.log('forecast layer onmouseup...');
	//document.getElementById("feature_info").innerHTML = document.getElementById('forecast_layer').value

//};


document.getElementById('display_date').onclick = function() {choose_date()};


// -------- Choose date function ----------------

function choose_date() {

  var e = document.getElementById("dates");
	var date = e.options[e.selectedIndex].text;
	var val = e.options[e.selectedIndex].value;


	//var date = document.getElementById('dates').value;
	console.log("Display date: ", date);
	console.log("Display value: ", val);

	var match_time = document.getElementById('match_timeframe').value;
	console.log("Match timeframe: ", match_time);

  //document.getElementById('forecast_months').value = 1;


  var date_arr = date.split('-');
	var n_parts = date_arr.length;


	if (n_parts == 1) {
		if(date_arr[0].startsWith("Mean")) {
      console.log("Mean data_arr");
		} else {
			var year = date_arr[0];
			document.getElementById('forecast_years').value = year;
			if (match_time == "on") {
				document.getElementById('eo_years').value = year;
			};
		};
	};

	if (n_parts == 2) {
		var month = date_arr[0];
		var dekad = date_arr[1];
  	document.getElementById('forecast_months').value = month;
		document.getElementById('forecast_dekads').value = dekad;
		if (match_time == "on") {
			if (month < 10) { month = '0' + month}
			document.getElementById('eo_months').value = month;
			if (dekad == "1") { dekad = '01'; }
			if (dekad == "2") { dekad = '11'; }
			if (dekad == "3") { dekad = '21'; }
			document.getElementById('eo_dekads').value = dekad;
		};
	}

	if (n_parts == 3) {
		var year = date_arr[0];
		var month = date_arr[1];
		var dekad = date_arr[2];
		document.getElementById('forecast_years').value = year;
		document.getElementById('forecast_months').value = month;
		document.getElementById('forecast_dekads').value = dekad;
		if (match_time == "on") {
			document.getElementById('eo_years').value = year;
			if (month < 10) { month = '0' + month}
			document.getElementById('eo_months').value = month;
			if (dekad == "1") { dekad = '01'; }
			if (dekad == "2") { dekad = '11'; }
			if (dekad == "3") { dekad = '21'; }
			document.getElementById('eo_dekads').value = dekad;
		};
	}




	var home_form = document.getElementById('home_form');
	console.log("home_form: ", home_form);
	//home_form.submit();


} // ------- end set date ----------------

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




load_fcast = true;

if (load_fcast) {
	console.log('loading forecast...');
	var fcast_source = new ol.source.ImageWMS({
	  url: geoserver_url + '/wms',
	  params: {'SLD': forecast_sld_file},
	  serverType: 'geoserver',
	});
  console.log('SLD: ', forecast_sld_file);

	var map_fcast = new ol.Map({
	  target: 'map_fcast',
		controls: ol.control.defaults({
	    zoom: true,
	    attribution: false,
	    rotate: false
	  }),
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

map_fcast.on('moveend', onMoveEnd);

//map_fcast.on('moveend', function (evt) {
//	console.log("in moveend...");
//});

map_fcast.on('singleclick', function (evt) {

  var message = '';

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
          //console.log('before: ', size, div_size);

          setTimeout( function() { map_fcast.updateSize();}, 500);
          setTimeout( function() { map_eo.updateSize();}, 600);


          map_fcast.getLayers().forEach(layer => layer.getSource().refresh());

          size = map_fcast.getSize();
          //extent = map_fcast.calculateExtent(size);
          div_size = document.getElementById("map_fcast").getBoundingClientRect();
          //console.log('after: ', size, div_size)
          map_fcast.changed();
          map_eo.changed();
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
