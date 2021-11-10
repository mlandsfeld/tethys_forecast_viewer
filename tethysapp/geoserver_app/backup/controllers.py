import random
import string

from django.shortcuts import render
from tethys_sdk.permissions import login_required
from django.views.decorators.csrf import csrf_exempt

from tethys_sdk.gizmos import *
from .app import GeoserverApp as app


WORKSPACE = 'geoserver_app'
#GEOSERVER_URI = 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver-app'
GEOSERVER_URI = 'http://www.example.com/geoserver-app'

@csrf_exempt
#@login_required()
def home(request):
    """
    Controller for the home page 
    """
    geoserver_engine = app.get_spatial_dataset_service(name='main_geoserver', as_engine=True)
    print('In home(request) controller')
    
    options = []
    layer = [
      "africa:g2008_af_1",
      "chirps_africa_1-month-09-2020_mm_data,africa:g2008_af_1", 
      "lst_global_1-month-09-2020_C_data,africa:g2008_af_1", 
      "chirtmax_global_1-month-12-2016_C_data,africa:g2008_af_1",
      "geoserver_app:yield_obs_ts_4,africa:g2008_af_1",
      "chirtmax_global_1-month-12-2016_C_data,africa:g2008_af_1,geoserver_app:yield_obs_ts_4,africa:g2008_af_1",
    ]
    for l in layer:
      options.append((l, l))

    select_options = SelectInput(
        display_text='Choose Earth Observation',
        name='layer',
        multiple=False,
        options=options
    )

    map_layers = []

    if request.POST and 'layer' in request.POST:
        selected_layer = request.POST['layer']
        #print('request.POST: ' + request.POST[0])
        print(type(selected_layer))

        print('selected_layer: ' + selected_layer)
        legend_title = selected_layer.title()
        #print(dir(selected_layer))
        #print('legend_title: ' + legend_title)

        geoserver_layer = MVLayer(
            source='ImageWMS',
            options={
                'url': 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver/wms',
                'urlxxx': 'http://localhost:8081/geoserver/wms',
                'params': {'LAYERS': selected_layer},
                'serverType': 'geoserver'
            },
            legend_title=legend_title,
            legend_extent=[-115, 36.5, -109, 42.5],
            legend_classes=[
              MVLegendImageClass(
            	value='Precipitation(mm)',
            	image_url='http://chg-ewxtest.chc.ucsb.edu/images/legends/precip_dekad_data_raster.png',
              )
			]
		)

        map_layers.append(geoserver_layer)


    view_options = MVView(
        projection='EPSG:4326',
        center=[41, 5],
        zoom=5,
        maxZoom=18,
        minZoom=2
    )

    map_options = MapView(
        height='100%',
        width='100%',
        layers=map_layers,
        legend=True,
        view=view_options
    )

    context = {'map_options': map_options,
               'select_options': select_options}

    return render(request, 'geoserver_app/app_two_columns.html', context)


#@login_required()
def map(request):
    """
    Controller for the map page 
    """
    print('In map(request) controller')

    geoserver_engine = app.get_spatial_dataset_service(name='main_geoserver', as_engine=True)

    options = []
    layer = [
      "africa:g2008_af_1",
      "chirps_africa_1-month-09-2020_mm_data,africa:g2008_af_1", 
      "lst_global_1-month-09-2020_C_data,africa:g2008_af_1", 
      "chirtmax_global_1-month-12-2016_C_data,africa:g2008_af_1",
      "geoserver_app:yield_obs_ts_4,africa:g2008_af_1",
      "chirtmax_global_1-month-12-2016_C_data,africa:g2008_af_1,geoserver_app:yield_obs_ts_4,africa:g2008_af_1",
    ]
    for l in layer:
      options.append((l, l))

    select_options = SelectInput(
        display_text='Choose Earth Observation',
        name='layer',
        multiple=False,
        options=options
    )

    map_layers = []

    if request.POST and 'layer' in request.POST:
        selected_layer = request.POST['layer']
        print('Selected layer type: ')
        print(type(selected_layer))

        print('selected_layer: ' + selected_layer)
        legend_title = selected_layer.title()
        #print(dir(selected_layer))
        print('legend_title: ' + legend_title)

        geoserver_layer = MVLayer(
            source='ImageWMS',
            options={
                'url': 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver/wms',
                'urlxxx': 'http://localhost:8081/geoserver/wms',
                'params': {'LAYERS': selected_layer},
                'serverType': 'geoserver'
            },
            legend_title=legend_title,
            legend_extent=[-115, 36.5, -109, 42.5],
            legend_classes=[
              MVLegendImageClass(
            	value='Precipitation(mm)',
            	image_url='http://chg-ewxtest.chc.ucsb.edu/images/legends/precip_dekad_data_raster.png',
              )
			]
		)

        map_layers.append(geoserver_layer)


    view_options = MVView(
        projection='EPSG:4326',
        center=[41, 5],
        zoom=5,
        maxZoom=18,
        minZoom=2
    )

    map_options = MapView(
        height='500px',
        width='100%',
        layers=map_layers,
        legend=True,
        view=view_options
    )

    context = {'map_options': map_options,
               'select_options': select_options}

    return render(request, 'geoserver_app/map.html', context)


#@login_required()
def map_yields(request):
    """
    Controller for the map page
    """
    print('In map_yields(request) controller')

    geoserver_engine = app.get_spatial_dataset_service(name='main_geoserver', as_engine=True)

    options = []

    #response = geoserver_engine.list_layers(with_properties=False)
    #print(type(response))
    # dir(response)
    
    #if response['success']:
    #    for layer in response['result']:
    #        tit = layer.title()
    #        if tit.startswith('Yield'):
    #            options.append((layer.title(), layer))
    
    layer = [
    	"geoserver_app:yield_obs_ts_4",
    ]
    
    for l in layer:
    	options.append((l, l))

    select_options = SelectInput(
        display_text='Choose Forecast',
        name='layer',
        multiple=False,
        options=options
    )

    map_layers = []

    if request.POST and 'layer' in request.POST:
        selected_layer = request.POST['layer']
        print('Selected layer type: ')
        print(type(selected_layer))

        selected_layer = 'Yield obs 2015'
        print('selected_layer: ' + selected_layer)
        legend_title = selected_layer.title()
        #print(dir(selected_layer))
        #print('legend_title: ' + legend_title)

        geoserver_layer = MVLayer(
            source='ImageWMS',
            options={
                'urlxxx': 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver/wms',
                'url': 'http://localhost:8081/geoserver/wms',
                'params': {'LAYERS': selected_layer},
                'serverType': 'geoserver'
            },
            legend_title=legend_title,
            legend_extent=[-114, 36.5, -109, 42.5],
            legend_classes=[
                MVLegendClass('polygon', '> 2.0', fill='#440154'),
                MVLegendClass('polygon', '1.8 - 2.0', fill='#482475'),
                MVLegendClass('polygon', '1.6 - 1.8', fill='#414487'),
                MVLegendClass('polygon', '1.4 - 1.6', fill='#355f8d'),
                MVLegendClass('polygon', '1.2 - 1.4', fill='#2a788e'),
                MVLegendClass('polygon', '1.0 - 1.2', fill='#21908d'),
                MVLegendClass('polygon', '0.8 - 1.0', fill='#22a884'),
                MVLegendClass('polygon', '0.6 - 0.8', fill='#44bf70'),
                MVLegendClass('polygon', '0.4 - 0.6', fill='#7ad151'),
                MVLegendClass('polygon', '0.2 - 0.4', fill='#bddf26'),
                MVLegendClass('polygon', '< 0.2', fill='#fde725'),
			])

        map_layers.append(geoserver_layer)


    view_options = MVView(
        projection='EPSG:4326',
        center=[41, 5],
        zoom=5,
        maxZoom=18,
        minZoom=2
    )

    map_options = MapView(
        height='500px',
        width='100%',
        layers=map_layers,
        legend=True,
        view=view_options
    )

    context = {'map_options': map_options,
               'select_options': select_options}

    return render(request, 'geoserver_app/forecast_map.html', context)


#@login_required()
def create_shapefile(request):
    """
    Controller for the app home page.
    """
    # Retrieve a geoserver engine
    geoserver_engine = app.get_spatial_dataset_service(name='main_geoserver', as_engine=True)

    # Check for workspace and create workspace for app if it doesn't exist
    response = geoserver_engine.list_workspaces()
    # print(response)

    if response['success']:
        workspaces = response['result']

        if WORKSPACE not in workspaces:
            geoserver_engine.create_workspace(workspace_id=WORKSPACE, uri=GEOSERVER_URI)

    # Case where the form has been submitted
    if request.POST and 'submit' in request.POST:
        # Verify files are included with the form
        if request.FILES and 'files' in request.FILES:
            # Get a list of the files
            file_list = request.FILES.getlist('files')

            # Upload shapefile
            store = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(6))
            store_id = WORKSPACE + ':' + store
            geoserver_engine.create_shapefile_resource(
                store_id=store_id,
                shapefile_upload=file_list,
                overwrite=True
            )

    context = {}

    return render(request, 'geoserver_app/home.html', context)
