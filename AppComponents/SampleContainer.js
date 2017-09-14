'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    NativeModules,
} from 'react-native';

import MapView from '../ArcGISReactComponents/MapView';
import Point from '../ArcGISJavascriptModels/Point';
import Polyline from '../ArcGISJavascriptModels/Polyline';
import SimpleMarkerSymbol from '../ArcGISJavascriptModels/SimpleMarkerSymbol';
import SimpleLineSymbol from '../ArcGISJavascriptModels/SimpleLineSymbol';
import SpatialReference from '../ArcGISJavascriptModels/SpatialReference';
import GraphicsOverlay from '../ArcGISJavascriptModels/GraphicsOverlay';


import CustomCalloutView from './CustomCalloutView';
import SearchPlaceTextInput from './SearchPlaceTextInput';
import SearchResultsListView from './SearchResultsListView';

let {LocatorTask} = NativeModules;
export default class SampleContainer extends Component {

    // Lifecycle methods ----->

    constructor(props) {
        super(props);

        let esriPoint = Point.pointWGS84(34.057,-117.196);

        this.places = [];

        this.state = {
            searchData: null,
            viewPointCenter:esriPoint,
            graphicsOverlays:{
                "pointOverlay": new GraphicsOverlay(),
                "lineOverlay": new GraphicsOverlay(),
                "polygonOverlay":new GraphicsOverlay()
            },
            callout: {
                visible:false,
            }
        };
    }

    componentDidMount() {
        // careful of spelling here!
        LocatorTask.initWithURL('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer');
    }


    render() {
        let {searchData, viewPointCenter, callout, graphicsOverlays} = this.state;
        return (
        <View style={styles.container}>

            <SearchPlaceTextInput onSearchComplete={this._onSearchComplete}/>
            <MapView ref={mapView => {this._mapView = mapView; }}
                     graphicsOverlays={graphicsOverlays}
                     style={styles.map}
                     viewPointCenter={viewPointCenter}
                     onTap={this._onMapTapped}>
                <CustomCalloutView visible={callout.visible}
                                   placeData={callout.placeData}
                                   isFlightsButtonVisible={callout.isFlightsButtonVisible}
                                   onSave={this._onSavePressed}
                                   onShowFlightPath={this._onShowFlightPath}/>
            </MapView>

            <SearchResultsListView data={searchData}
                                   onSearchItemPress={this._onSearchItemPress}/>
        </View>
        );
    }


    // Events ----->

    _onSearchComplete = (results) => {
        this.setState({
            searchData:results
        });
    };

    _onSearchItemPress = (searchItem) => {
        LocatorTask.geocodeWithSearchText(searchItem.label)
            .then(this._handleGeocodeSuccess)
            .catch(this._handleGeocodeFailure);
    };

    _handleGeocodeSuccess = (results) => {
        let topResult = results[0];

        let callout = {
            visible:true,
            placeData:{
                placeName:topResult.label,
                locationPoint:topResult.displayLocation
            },
        };

        this.setState({
            viewPointCenter:topResult.displayLocation,
            searchData:null,
            callout:callout
        });
    };

    _handleGeocodeFailure = (error) => {
        this._handleLocatorSuggestionsFailure(error);
    };

    _onMapTapped = (event) => {
        let tolerance = 10;
        let maxResults = 5;
        this._mapView.identifyGraphicsOverlays("pointOverlay", event.screenPoint, tolerance, false, maxResults)
            .then(this._onIdentifySuccess)
            .catch((err) => console.log(err))
    };

    _onIdentifySuccess = (results) => {
        let callout = {};
        if(results.length === 0) {
            callout.visible = false;
        }
        else {
            let selectedGraphic = results[0];
            callout.visible = true;
            callout.isFlightsButtonVisible = true;
            callout.placeData = selectedGraphic.attributes;
        }

        this.setState({
            callout:callout
        });
    };

    _addPointOnMap = (placeData) => {
        let markerSymbol;
        if(placeData.isVisited) {
            markerSymbol =  SimpleMarkerSymbol.symbol( SimpleMarkerSymbol.Style.Triangle, 'rgba(100,34,255,1)', 10);
        }
        else if(placeData.isWishlist) {
            markerSymbol =  SimpleMarkerSymbol.symbol( SimpleMarkerSymbol.Style.Diamond, 'red', 10);
        }

        let pointGraphic = {
            geometry:placeData.locationPoint,
            symbol:markerSymbol,
            attributes:placeData
        };
        this._mapView.addGraphics([pointGraphic],"pointOverlay");
        this.places.push(placeData);
    };

    _addLineOnMap = (point1, point2) => {
        let lineSymbol =  SimpleLineSymbol.symbol( SimpleLineSymbol.Style.DashDot, 'green', 3);
        let line = new  Polyline({
            spatialReference: SpatialReference.WGS84()
        });

        line.addPoint(point1.x,point1.y);
        line.addPoint(point2.x,point2.y);

        let lineGraphic = {
            geometry:line,
            symbol:lineSymbol
        };
        this._mapView.addGraphics([lineGraphic],"lineOverlay");
    };

    _onSavePressed = (placeData) => {
        this._addPointOnMap(placeData);

        this._hideCallout();
    };

    _onShowFlightPath = (fromPlace) => {
        this.places.forEach((place) => {
            this._addLineOnMap(fromPlace.locationPoint, place.locationPoint);
        });

        this._hideCallout();
    };

    _hideCallout = () => {
        this.setState({
            callout:{
                visible:false
            }
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: 65,
        backgroundColor: 'gray'
    },
    map:{
        flex:1
    }
});
