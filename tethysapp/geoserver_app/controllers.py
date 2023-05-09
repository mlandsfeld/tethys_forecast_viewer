import random
import string

from django.shortcuts import render
from tethys_sdk.permissions import login_required
from django.views.decorators.csrf import csrf_exempt

from tethys_sdk.gizmos import *
from .app import GeoserverApp as app
from tethys_sdk.gizmos import MapView

#WORKSPACE = 'geoserver_app'
#GEOSERVER_URI = 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver-app'
#GEOSERVER_URI = 'http://www.example.com/geoserver-app'

@csrf_exempt
@login_required()
def home(request):
    """
    Controller for the home page
    """
    geoserver_engine = app.get_spatial_dataset_service(name='main_geoserver', as_engine=True)
    #eros_geoserver_engine = app.get_spatial_dataset_service(name='EROS_geoserver', as_engine=True)
    print('In home(request) controller')


    #-----------------------------

    eo_layers = "chirps_global_1-month-01-2023_mm_data,africa:g2008_af_1"
    eo_layers = "EWX_chirps_global_1_monthly_data:chirps_global_1_monthly_data,EWX_shapefile_g2008_af_1:shapefile_g2008_af_1"
    eo_legend_url='https://chc-ewx3.chc.ucsb.edu/legends/precip_monthly_data_raster.png'
    eo_geoserver_url = 'https://chc-ewx3.chc.ucsb.edu:8443/geoserver/wms'

    eo_options = [
      ("CHIRPS Data", "EWX_chirps_global_1_monthly_data:chirps_global_1_monthly_data,EWX_shapefile_g2008_af_1:shapefile_g2008_af_1"),
      ("CHIRPS Anomaly", "EWX_chirps_global_1_monthly_anom:chirps_global_1_monthly_anom,EWX_shapefile_g2008_af_1:shapefile_g2008_af_1"),
      ("CHIRPS Z-score", "EWX_chirps_global_1_monthly_zscore:chirps_global_1_monthly_zscore,EWX_shapefile_g2008_af_1:shapefile_g2008_af_1"),
      ("LST Data", "EWX_lst006_global_1_monthly_data:lst006_global_1_monthly_data,EWX_shapefile_g2008_af_1:shapefile_g2008_af_1"),
      ("LST Anomaly", "EWX_lst006_global_1_monthly_anom:lst006_global_1_monthly_anom,EWX_shapefile_g2008_af_1:shapefile_g2008_af_1"),
      ("LST Z-score", "EWX_lst006_global_1_monthly_zscore:lst006_global_1_monthly_zscore,EWX_shapefile_g2008_af_1:shapefile_g2008_af_1"),
      ("CHIRTSmax", "EWX_chirtsmax_global_1_monthly_data:chirtsmax_global_1_monthly_data,EWX_shapefile_g2008_af_1:shapefile_g2008_af_1"),
      ("Hobbins RefET", "EWX_hobbins_refet_global_1_monthly_data:hobbins_refet_global_1_monthly_data,EWX_shapefile_g2008_af_1:shapefile_g2008_af_1"),
      ("MODIS NDVI", "fews_eviirsndvi_africa_pentad_data:eviirsndvi_africa_pentad_data,fews_shapefile_g2008_af_1:shapefile_g2008_af_1"),
    ]
    # ewx2
    #("CHIRPS data", "chirps_global_1-month-{month}-{year}_mm_data,africa:g2008_af_1")
    #("CHIRPS anomaly", "chirps_global_1-month-{month}-{year}_mm_anomaly,africa:g2008_af_1"),
    #("CHIRPS z-score", "chirps_global_1-month-{month}-{year}_none_z-score,africa:g2008_af_1"),
    #("LST Data", "lst_global_1-month-{month}-{year}_C_data,africa:g2008_af_1"),
    #("LST Anomaly", "lst_global_1-month-{month}-{year}_C_anomaly,africa:g2008_af_1"),
    #("LST Z-score", "lst_global_1-month-{month}-{year}_none_z-score,africa:g2008_af_1"),
    #("CHIRTSmax", "chirtsmax_global_1-month-{month}-{year}_mm_data,africa:g2008_af_1"),
    #("Hobbins RefET", "hobbinset_global_1-month-{month}-{year}_mm_data,africa:g2008_af_1"),
    #("MODIS NDVI", "fews_emodisndvic6v2_africa_dekad_data:emodisndvic6v2_africa_dekad_data,fews_shapefile_g2008_af_1:shapefile_g2008_af_1"),

    eo_select_options = SelectInput(
        display_text='Choose Earth Observation',
        name='eo_layers',
        multiple=False,
        options=eo_options,
        attributes={"style":"width:50%;"},
        original=True
    )

    eo_years = [
      ("--", "--"),
      ("1980", "1980"),
      ("1981", "1981"),
      ("1982", "1982"),
      ("1983", "1983"),
      ("1984", "1984"),
      ("1985", "1985"),
      ("1986", "1986"),
      ("1987", "1987"),
      ("1988", "1988"),
      ("1989", "1989"),
      ("1990", "1990"),
      ("1991", "1991"),
      ("1992", "1992"),
      ("1993", "1993"),
      ("1994", "1994"),
      ("1995", "1995"),
      ("1996", "1996"),
      ("1997", "1997"),
      ("1998", "1998"),
      ("1999", "1999"),
      ("2000", "2000"),
      ("2001", "2001"),
      ("2002", "2002"),
      ("2003", "2003"),
      ("2004", "2004"),
      ("2005", "2005"),
      ("2006", "2006"),
      ("2007", "2007"),
      ("2008", "2008"),
      ("2009", "2009"),
      ("2010", "2010"),
      ("2011", "2011"),
      ("2012", "2012"),
      ("2013", "2013"),
      ("2014", "2014"),
      ("2015", "2015"),
      ("2016", "2016"),
      ("2017", "2017"),
      ("2018", "2018"),
      ("2019", "2019"),
      ("2020", "2020"),
      ("2021", "2021"),
      ("2022", "2022"),
      ("2023", "2023"),
      ("2024", "2024"),
    ]

    eo_years_options = SelectInput(
        display_text='Choose Year',
        name='eo_years',
        multiple=False,
        options=eo_years,
        attributes={"style":"width:75%;"},
        initial='2023',
        original=True,
    )

    eo_months = [
      ("01", "01"),
      ("02", "02"),
      ("03", "03"),
      ("04", "04"),
      ("05", "05"),
      ("06", "06"),
      ("07", "07"),
      ("08", "08"),
      ("09", "09"),
      ("10", "10"),
      ("11", "11"),
      ("12", "12"),
    ]

    eo_months_options = SelectInput(
        display_text='Choose Month',
        name='eo_months',
        multiple=False,
        options=eo_months,
        initial='05',
        attributes={"style":"width:33%;"},
        original=True
    )

    # dekads define first day of dekad
    eo_dekads = [
      ("01", "01"),
      ("02", "11"),
      ("03", "21"),
    ]

    eo_dekads_options = SelectInput(
        display_text='Choose Dekad',
        name='eo_dekads',
        multiple=False,
        options=eo_dekads,
        initial='03',
        attributes={"style":"width:75%;"},
        original=True
    )


    #-----------------------------


    forecast_layer = "L_fcast_MAPE_ET"
    forecast_sld_file = "https://chc-ewx3.chc.ucsb.edu/sld/DEFAULT.SLD/NO_MATCH_FOUND"
    forecast_legend_url='https://chc-ewx3.chc.ucsb.edu/images/legends/crop_yield.png'

    forecast_options = [
      ("Current Forecast (%)",  "current_CI"),
      ("Current Forecast low (%)",  "current_CI_low"),
      ("Current Forecast high (%)",  "current_CI_high"),
      ("Historical Forecast (%)",  "Historic_forecast"),
      ("Historical Yield Forecast (MT)",  "forecast"),
      ("Historical Yield Forecast Error", "forecast_err"),
      ("Historical Yield Forecast MAPE", "MAPE"),
      ("Historical Yield Forecast Hindcast", "hind"),
      ("Historical Yield Forecast Hindcast %", "hind_perc"),
      ("Area", "area"),
      ("Area Mean (10 years)", "area_mean_10yr"),
      ("Area Mean (all years)", "area_mean_all"),
      ("Production", "prod"),
      ("Production Mean (10 years)", "prod_mean_10yr"),
      ("Production Mean (all years)", "prod_mean_all"),
      ("Yield", "yield"),
      ("Yield Mean (10 years)", "yield_mean_10yr"),
      ("Yield Mean (all years)", "yield_mean_all")
    ]

    forecast_select_options = SelectInput(
        display_text='Choose Feature',
        name='forecast_layer',
        multiple=False,
        options=forecast_options,
        attributes={"onmouseup":"display_feature_info();", "style":"width:75%;"},
        original=True
    )

    model_options = [
      ("GB",  "GB"),
      ("ET",  "ET"),
      ("RHEAS",  "RHEAS"),
      ("GeoCIF",  "GeoCIF"),
    ]

    forecast_model_options = SelectInput(
        display_text='Choose Model',
        name='forecast_model',
        multiple=False,
        options=model_options,
        attributes={"style":"width:75%;"},
        original=True
    )

    forecast_crops = [
      ("Maize", "maize"),
      ("Sorghum", "sorghum"),
    ]

    forecast_crops_options = SelectInput(
        display_text='Choose Crop',
        name='forecast_crops',
        multiple=False,
        options=forecast_crops,
        initial='maize',
        attributes={"style":"width:75%;"},
        original=True
    )

    forecast_season = [
      ("Long", "long"),
      ("Short", "short"),
    ]

    forecast_season_options = SelectInput(
        display_text='Choose Season',
        name='forecast_season',
        multiple=False,
        options=forecast_season,
        initial='short',
        attributes={"style":"width:75%;"},
        original=True
    )

    forecast_years = [
      ("--", "--"),
      ("1980", "1980"),
      ("1981", "1981"),
      ("1982", "1982"),
      ("1983", "1983"),
      ("1984", "1984"),
      ("1985", "1985"),
      ("1986", "1986"),
      ("1987", "1987"),
      ("1988", "1988"),
      ("1989", "1989"),
      ("1990", "1990"),
      ("1991", "1991"),
      ("1992", "1992"),
      ("1993", "1993"),
      ("1994", "1994"),
      ("1995", "1995"),
      ("1996", "1996"),
      ("1997", "1997"),
      ("1998", "1998"),
      ("1999", "1999"),
      ("2000", "2000"),
      ("2001", "2001"),
      ("2002", "2002"),
      ("2003", "2003"),
      ("2004", "2004"),
      ("2005", "2005"),
      ("2006", "2006"),
      ("2007", "2007"),
      ("2008", "2008"),
      ("2009", "2009"),
      ("2010", "2010"),
      ("2011", "2011"),
      ("2012", "2012"),
      ("2013", "2013"),
      ("2014", "2014"),
      ("2015", "2015"),
      ("2016", "2016"),
      ("2017", "2017"),
      ("2018", "2018"),
      ("2019", "2019"),
      ("2020", "2020"),
      ("2021", "2021"),
      ("2022", "2022"),
      ("2023", "2023"),
      ("2024", "2024"),
    ]

    forecast_years_options = SelectInput(
        display_text='Choose Year',
        name='forecast_years',
        multiple=False,
        options=forecast_years,
        attributes={"style":"width:75%;"},
        initial='2023',
        original=True
    )

    forecast_months = [
      ("--", "--"),
      ("1", "1"),
      ("2", "2"),
      ("3", "3"),
      ("4", "4"),
      ("5", "5"),
      ("6", "6"),
      ("7", "7"),
      ("8", "8"),
      ("9", "9"),
      ("10", "10"),
      ("11", "11"),
      ("12", "12"),
    ]

    forecast_months_options = SelectInput(
        display_text='Choose Month',
        name='forecast_months',
        multiple=False,
        options=forecast_months,
        initial='1',
        attributes={"style":"width:50%;"},
        original=True
    )

    forecast_dekads = [
      ("--", "--"),
      ("1", "1"),
      ("2", "2"),
      ("3", "3"),
    ]

    forecast_dekads_options = SelectInput(
        display_text='Choose Dekad',
        name='forecast_dekads',
        multiple=False,
        options=forecast_dekads,
        initial='3',
        attributes={"style":"width:50%;"},
        original=True
    )

    match_timeframe = [
      ("On", "on"),
      ("Off", "off"),
    ]

    match_timeframe_options = SelectInput(
        display_text='Match Timeframe',
        name='match_timeframe',
        multiple=False,
        options=match_timeframe,
        initial='On',
        attributes={"style":"width:25%;background-color:lightgreen;"},
        original=True
    )


    #-----------------------------

    if not " " in locals():
        print("no EO map defined")
    eo_map_layers = []
    eo_time = ""
    forecast_property = 'F202313' #remove when done with all datasets
    forecast_shapefile = 'ag_monitor_maize_GB:S_current_fcast_GB'
    if request.POST:
        print("request.POST exists...");


    # ========  Start POST request processing  ==============
    if request.POST  and 'update_maps' in request.POST:
    # if 1 == 1:

        print("")
        print('In update_maps Post request')

        eo_map_layers = []

        selected_layer = request.POST['eo_layers']
        print('EO selected_layer: ' + selected_layer)
        eo_select_options.initial=selected_layer

        m_timeframe = request.POST['match_timeframe']
        print('match_timeframe: ' + m_timeframe)

        if m_timeframe == 'on':
        	year = request.POST['forecast_years']
        else:
        	year = request.POST['eo_years']
        eo_years_options.initial=year

        if m_timeframe == 'on':
            month = request.POST['forecast_months']
            print('forecast_month: ', month)
            if int(month) < 10:
                month = '0' + month
                print('forecast_month: ', month)
        else:
            month = request.POST['eo_months']
        eo_months_options.initial=month

        if m_timeframe == 'on':
            dekad = request.POST['forecast_dekads']
            if int(dekad) < 10:
                dekad = '0' + dekad
                print('forecast_dekad: ', dekad)
        else:
            dekad = request.POST['eo_dekads']
        eo_dekads_options.initial=dekad

        #eo_geoserver_url = 'https://chc-ewx2.chc.ucsb.edu:8443/geoserver/wms'
        eo_geoserver_url = 'https://chc-ewx3.chc.ucsb.edu:8443/geoserver/wms'

        #legends_url = 'https://chc-ewx2.chc.ucsb.edu/images/legends/'
        legends_url = 'https://ewx3.chc.ucsb.edu/legends/'
        print('Legends URL: ', legends_url)

        if 'fews_emodis' in selected_layer:
        	eo_geoserver_url = 'https://dmsdata.cr.usgs.gov/geoserver/gwc/service/wms'

        if 'data' in selected_layer:
            print('Data legend')
            eo_legend_url=f"{legends_url}precip_monthly_data_raster.png"
        if 'anom' in selected_layer:
            print('Anomaly legend')
            eo_legend_url=f"{legends_url}precip_monthly_anom_raster.png"
        if 'zscore' in selected_layer:
            print('Z-score legend')
            eo_legend_url=f"{legends_url}precip_zscore_raster.png"
        if 'chirtsmax' in selected_layer:
            if 'data' in selected_layer:
                eo_legend_url=f"{legends_url}temperature.png"
            if 'anom' in selected_layer:
                eo_legend_url=f"{legends_url}temperature_anom.png"
            if 'zscore' in selected_layer:
                eo_legend_url=f"{legends_url}temperature_zscore.png"
        if 'lst006_global' in selected_layer:
            if 'data' in selected_layer:
                eo_legend_url=f"{legends_url}temperature.png"
            if 'anom' in selected_layer:
                eo_legend_url=f"{legends_url}temperature_anom.png"
            if 'z-score' in selected_layer:
                eo_legend_url=f"{legends_url}temperature_zscore.png"
        if 'hobbins_refet' in selected_layer:
            if 'data' in selected_layer:
                eo_legend_url=f"{legends_url}refet0_monthly_data_raster.png"
        if 'ndvi' in selected_layer:
            if 'data' in selected_layer:
                eo_legend_url=f"{legends_url}ndvi_data.png"
                eo_geoserver_url = 'https://dmsdata.cr.usgs.gov/geoserver/wms'

        print('eo_legend_url: ', eo_legend_url)
        print('eo_geoserver_url: ', eo_geoserver_url)

        #eo_time = f"{year}-{month}-{dekad}" #ewx2
        eo_time = f"{year}-{month}-01"
        print("EO time: " + eo_time)

        eo_layers = selected_layer.format(month=month, year=year)
        print('eo_layers: ', eo_layers)



        #------- Process forecast model attributes  ----------------


        print("")
        print('Process forecast model attributes', request.POST)



        forecast_model = request.POST['forecast_model']
        print('forecast_model: ' + forecast_model)
        forecast_model_options.initial=forecast_model

        if forecast_model == 'ET':
          fcast_model = ""
          shape_model = "_ET"
        elif forecast_model == 'GB':
          fcast_model = '_GB'
          shape_model = "_GB"
        elif forecast_model == 'RHEAS':
          fcast_model = '_RH'
          shape_model = "_RH"
        elif forecast_model == 'GeoCIF':
          fcast_model = '_GC'
          shape_model = "_GC"

        selected_layer = request.POST['forecast_layer']
        forecast_layer = selected_layer
        print('forecast selected_layer: ' + selected_layer)
        print('forecast_layer: ' + forecast_layer)
        #forecast_select_options.initial='ET_forecast_pcnt'
        forecast_select_options.initial=selected_layer

        year = request.POST['forecast_years']
        print('selected_year: ' + year)
        forecast_years_options.initial=year

        month = request.POST['forecast_months']
        print('selected_month: ' + month)
        forecast_months_options.initial=month

        dekad = request.POST['forecast_dekads']
        print('selected_dekad: ' + dekad)
        forecast_dekads_options.initial=dekad

        crop = request.POST['forecast_crops']
        print('selected_crop: ' + crop)
        forecast_crops_options.initial=crop

        forecast_season = request.POST['forecast_season']
        print('selected_season: ' + forecast_season)
        forecast_season_options.initial = forecast_season

        m_timeframe = request.POST['match_timeframe']
        print('match_timeframe: ' + m_timeframe)
        match_timeframe_options.initial = m_timeframe

        #sld_url = "https://chc-ewx2.chc.ucsb.edu/sld/"
        sld_url = "https://ewx3.chc.ucsb.edu/sld/"

        if forecast_season == 'long':
          season = "L"
        elif forecast_season == 'short':
          season = 'S'

        print('selected_crops: ' + crop)
        if crop == 'maize':
          crop_dir = 'maize/'
        elif crop == 'sorghum':
          crop_dir = 'sorghum/'
        print('crop_dir: ' + crop_dir)


        if selected_layer == "current_CI":
          forecast_shapefile = f"ag_monitor_{crop}{fcast_model}:{season}_current_fcast{shape_model}"
          forecast_sld_file = f"{sld_url}{forecast_model}_cur_CI/{crop}/{season}{shape_model}_cur_CI_{year}{month}{dekad}.sld"
          forecast_legend_url=f"{legends_url}crop_yield_ci.png"
          forecast_property = f"F{year}{month}{dekad}"
          print("forecast_shapefile: ", forecast_shapefile)

        if selected_layer == "current_CI_low":
          forecast_shapefile = f"ag_monitor_{crop}{fcast_model}:{season}_current_fcast{shape_model}"
          forecast_sld_file = f"{sld_url}{forecast_model}_cur_CI/{crop}/{season}{shape_model}_cur_CI_lo_{year}{month}{dekad}.sld"
          forecast_legend_url=f"{legends_url}crop_yield_ci.png"
          forecast_property = f"LOF{year}{month}{dekad}"
          print("forecast_shapefile: ", forecast_shapefile)

        if selected_layer == "current_CI_high":
          forecast_shapefile = f"ag_monitor_{crop}{fcast_model}:{season}_current_fcast{shape_model}"
          forecast_sld_file = f"{sld_url}{forecast_model}_cur_CI/{crop}/{season}{shape_model}_cur_CI_hi_{year}{month}{dekad}.sld"
          forecast_legend_url=f"{legends_url}crop_yield_ci.png"
          forecast_property = f"HIF{year}{month}{dekad}"

        if selected_layer == "Historic_forecast":
          forecast_shapefile = f"ag_monitor_{crop}{fcast_model}:{season}_fcast{shape_model}_percent"
          forecast_sld_file = f"{sld_url}{forecast_model}_fcast_pcnt/{crop}/{season}{shape_model}_pcnt_{year}{month}{dekad}.sld"
          forecast_legend_url=f"{legends_url}crop_yield_ci.png"
          forecast_property = f"F{year}{month}{dekad}"
          print("forecast_shapefile: ", forecast_shapefile)

        if selected_layer == "forecast":
          forecast_shapefile = f"ag_monitor_{crop}{fcast_model}:{season}_fcast{shape_model}"
          forecast_sld_file = f"{sld_url}{forecast_model}_fcast/{crop}/{season}{shape_model}_fcast_{year}{month}{dekad}.sld"
          forecast_legend_url=f"{legends_url}crop_yield1.png"
          forecast_property = f"F{year}{month}{dekad}"

        if selected_layer == "forecast_err":
          forecast_shapefile = f"ag_monitor_{crop}{fcast_model}:{season}_fcast_error{shape_model}"
          forecast_sld_file = f"{sld_url}{forecast_model}_error/{crop}/{season}{shape_model}_err_{year}{month}{dekad}.sld"
          forecast_legend_url=f"{legends_url}crop_yield_error.png"
          forecast_property = f"E{year}{month}{dekad}"

        if selected_layer == "MAPE":
          forecast_shapefile = f"ag_monitor_{crop}{fcast_model}:{season}_fcast_MAPE{shape_model}"
          forecast_sld_file = f"{sld_url}{forecast_model}_MAPE/{crop}/{season}{shape_model}_MAPE_{month}_{dekad}.sld"
          forecast_legend_url=f"{legends_url}crop_yield_MAPE.png"
          forecast_property = f"MP_{month}_{dekad}"

        if selected_layer == "hind":
          forecast_shapefile = f"ag_monitor_{crop}{fcast_model}:{season}_fcast{shape_model}_HIND"
          forecast_sld_file = f"{sld_url}{forecast_model}_fcast_HIND/{crop}/{season}{shape_model}_HIND_{year}{month}{dekad}.sld"
          forecast_legend_url=f"{legends_url}crop_yield1.png"
          forecast_property = f"F{year}{month}{dekad}"


        if selected_layer == "hind_perc":
          forecast_shapefile = f"ag_monitor_{crop}{fcast_model}:{season}_fcast{shape_model}_HIND_percent"
          forecast_sld_file = f"{sld_url}{forecast_model}_fcast_HIND_percent/{crop}/{season}{shape_model}_HIND_pcnt_{year}{month}{dekad}.sld"
          forecast_legend_url=f"{legends_url}crop_yield_ci.png"
          forecast_property = f"F{year}{month}{dekad}"


        if selected_layer == "area":
          forecast_shapefile = f"ag_monitor_{crop}:{season}_area"
          forecast_sld_file = f"{sld_url}area/{crop}/area_{season}{year}.sld"
          forecast_legend_url=f"{legends_url}crop_area.png"
          forecast_property = f"O{year}"

        if selected_layer == "area_mean_10yr":
          forecast_shapefile = f"ag_monitor_{crop}:{season}_area_mn"
          forecast_sld_file = f"{sld_url}area/{crop}/{season}_area_mean_10yr.sld"
          forecast_legend_url=f"{legends_url}crop_area.png"
          forecast_property = "MN_10"

        if selected_layer == "area_mean_all":
          forecast_shapefile = f"ag_monitor_{crop}:{season}_area_mn"
          forecast_sld_file = f"{sld_url}area/{crop}/{season}_area_mean_all.sld"
          forecast_legend_url=f"{legends_url}crop_area.png"
          forecast_property = "MN_ALL"

        if selected_layer == "prod":
          forecast_shapefile = f"ag_monitor_{crop}:{season}_prod"
          forecast_sld_file = f"{sld_url}prod/{crop}/{season}_prod_{year}.sld"
          forecast_legend_url=f"{legends_url}crop_prod.png"
          forecast_property = f"O{year}"

        if selected_layer == "prod_mean_10yr":
          forecast_shapefile = f"ag_monitor_{crop}:{season}_prod_mn"
          forecast_sld_file = f"{sld_url}prod/{crop}/{season}_prod_mean_10yr.sld"
          forecast_legend_url=f"{legends_url}crop_prod.png"
          forecast_property = "MN_10"

        if selected_layer == "prod_mean_all":
          forecast_shapefile = f"ag_monitor_{crop}:{season}_prod_mn"
          forecast_sld_file = f"{sld_url}prod/{crop}/{season}_prod_mean_all.sld"
          forecast_legend_url=f"{legends_url}crop_prod.png"
          forecast_property = "MN_ALL"

        if selected_layer == "yield":
          forecast_shapefile = f"ag_monitor_{crop}:{season}_yield"
          forecast_sld_file = f"{sld_url}yield/{crop}/{season}_yield_{year}.sld"
          forecast_legend_url=f"{legends_url}crop_yield1.png"
          forecast_property = f"O{year}"

        if selected_layer == "yield_mean_10yr":
          forecast_shapefile = f"ag_monitor_{crop}:{season}_yield_mn"
          forecast_sld_file = f"{sld_url}yield/{crop}/{season}_yield_mean_10yr.sld"
          forecast_legend_url=f"{legends_url}crop_yield1.png"
          forecast_property = "MN_10"

        if selected_layer == "yield_mean_all":
          forecast_shapefile = f"ag_monitor_{crop}:{season}_yield_mn"
          forecast_sld_file = f"{sld_url}yield/{crop}/{season}_yield_mean_all.sld"
          forecast_legend_url=f"{legends_url}crop_yield1.png"
          forecast_property = "MN_ALL"

        #forecast_sld_file = f"https://chc-ewx2.chc.ucsb.edu/sld/yield_ET_err_long_{year}{month}{dekad}.sld"
        print("SLD file: ", forecast_sld_file)
        print("forecast_property: ", forecast_property)
        print("forecast_shapefile: ", forecast_shapefile)
        #legend_title = selected_layer.title()
        print("forecast_legend_url: ", forecast_legend_url)

    # END IF request.POST  and 'update_maps' in request.POST:


    eo_view_options = MVView(
        projection='EPSG:4326',
        center=[41, 5],
        zoom=5,
        maxZoom=18,
        minZoom=2
    )

    eo_map_options = MapView(
        height='100%',
        width='100%',
        layers=eo_map_layers,
        legend=True,
        view=eo_view_options
    )


    context = {
        #'eo_map_options': eo_map_options,
        'eo_layers': eo_layers,
        'eo_time': eo_time,
        'eo_geoserver_url': eo_geoserver_url,
        'eo_select_options': eo_select_options,
        'eo_years_options': eo_years_options,
        'eo_months_options': eo_months_options,
        'eo_dekads_options': eo_dekads_options,
        'eo_legend_url': eo_legend_url,
        #'forecast_map_options': forecast_map_options,
        'forecast_shapefile': forecast_shapefile,
        'forecast_property': forecast_property,
        'forecast_select_options': forecast_select_options,
        'forecast_model_options': forecast_model_options,
        'forecast_years_options': forecast_years_options,
        'forecast_months_options': forecast_months_options,
        'forecast_crops_options': forecast_crops_options,
        'forecast_dekads_options': forecast_dekads_options,
        'forecast_layer': forecast_layer,
        'forecast_sld_file': forecast_sld_file,
        'forecast_legend_url': forecast_legend_url,
        'forecast_season_options': forecast_season_options,
        'match_timeframe_options': match_timeframe_options,
    }

    return render(request, 'geoserver_app/home.html', context)
