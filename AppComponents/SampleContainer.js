'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    NativeModules,
} from 'react-native';

import AGSMapView from '../ArcGISReactComponents/AGSMapView';
import AGSPoint from '../ArcGISJavascriptModels/AGSPoint';
import AGSPolyline from '../ArcGISJavascriptModels/AGSPolyline';
import AGSSimpleMarkerSymbol from '../ArcGISJavascriptModels/AGSSimpleMarkerSymbol';
import AGSSimpleLineSymbol from '../ArcGISJavascriptModels/AGSSimpleLineSymbol';
import AGSSpatialReference from '../ArcGISJavascriptModels/AGSSpatialReference';

import CustomCalloutView from './CustomCalloutView';
import SearchPlaceTextInput from './SearchPlaceTextInput';
import SearchResultsListView from './SearchResultsListView';

let {AGSLocatorTask} = NativeModules;
export default class SampleContainer extends Component {

    // Lifecycle methods ----->

    constructor(props) {
        super(props);

        let esriPoint = AGSPoint.pointWGS84(34.057,-117.196);

        this.state = {
            searchData: null,
            viewPointCenter:esriPoint,
            callout: {
                visible:false,
            }
        };
    }


    render() {
        let {searchData, viewPointCenter, callout} = this.state;
        return (
        <View style={styles.container}>

            <SearchPlaceTextInput onSearchComplete={this._onSearchComplete}/>

            <AGSMapView ref={mapView => {this._mapView = mapView; }}
                        style={styles.map}
                        viewPointCenter={viewPointCenter}
                        onTap={this._onMapTapped}>
                <CustomCalloutView visible={callout.visible}
                                   placeData={callout.placeData}
                                   onSave={this._onSavePressed}/>
            </AGSMapView>

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
        AGSLocatorTask.geocodeWithSearchText(searchItem.label)
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
        this._mapView.identifyGraphicsOverlays(event.screenPoint, tolerance, false, maxResults)
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
            callout.placeData = selectedGraphic.attributes;
        }

        this.setState({
            callout:callout
        });
    };

    _addPointOnMap = (placeData) => {
        let markerSymbol = AGSSimpleMarkerSymbol.symbol(AGSSimpleMarkerSymbol.Style.Triangle, 'rgba(100,34,255,1)', 10);
        let pointGraphic = {
            geometry:placeData.locationPoint,
            symbol:markerSymbol,
            attributes:placeData
        };
        this._mapView.addGraphics([pointGraphic]);
    };

    _addLineOnMap = (point1, point2) => {
        let lineSymbol = AGSSimpleLineSymbol.symbol(AGSSimpleLineSymbol.Style.DashDot, 'rgba(100,34,255,1)', 10);
        let line = new AGSPolyline({
            spatialReference:AGSSpatialReference.WGS84()
        });

        line.addPoint(point1.x,point1.y);
        line.addPoint(point2.x,point2.y);

        let lineGraphic = {
            geometry:line,
            symbol:lineSymbol
        };
        this._mapView.addGraphics([lineGraphic]);
    };

    _onSavePressed = (placeData) => {
        this._addPointOnMap(placeData);

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
