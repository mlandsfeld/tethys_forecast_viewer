from tethys_sdk.base import TethysAppBase, url_map_maker
from tethys_sdk.app_settings import SpatialDatasetServiceSetting


class GeoserverApp(TethysAppBase):
    """
    Tethys app class for GeoServer App.
    """

    name = 'Forecast Viewer'
    index = 'geoserver_app:home'
    icon = 'geoserver_app/images/LogoBar_whiteBG-01.png'
    package = 'geoserver_app'
    root_url = 'geoserver-app'
    color = '#2980b9'
    description = 'Goserver app'
    tags = ''
    enable_feedback = False
    feedback_emails = []


    def spatial_dataset_service_settings(self):
        """
        Example spatial_dataset_service_settings method.
        """
        sds_settings = ( 
            SpatialDatasetServiceSetting(
                name='main_geoserver',
                description='spatial dataset service for app to use',
                engine=SpatialDatasetServiceSetting.GEOSERVER,
                required=True,
            ),
        )

        return sds_settings

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='geoserver-app',
                controller='geoserver_app.controllers.home'
            ),
        )

        return url_maps
