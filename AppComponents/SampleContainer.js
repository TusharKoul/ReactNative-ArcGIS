'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    NativeModules,
    TouchableHighlight,
} from 'react-native';

import AGSMapView from '../ArcGISReactComponents/AGSMapView';
import AGSPoint from '../ArcGISJavascriptModels/AGSPoint';
import AGSPolyline from '../ArcGISJavascriptModels/AGSPolyline';
import AGSSimpleMarkerSymbol from '../ArcGISJavascriptModels/AGSSimpleMarkerSymbol';
import AGSSimpleLineSymbol from '../ArcGISJavascriptModels/AGSSimpleLineSymbol';
import AGSSpatialReference from '../ArcGISJavascriptModels/AGSSpatialReference';

import CustomCalloutView from './CustomCalloutView';
import SearchPlaceTextInput from './SearchPlaceTextInput';

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
        let searchListView = (searchData) ? this._renderSearchListView() : null;
        return (
        <View style={styles.container}>

            <SearchPlaceTextInput onSearchComplete={this._onSearchComplete}/>

            <AGSMapView ref={mapView => {this._mapView = mapView; }}
                        style={styles.map}
                        viewPointCenter={viewPointCenter}
                        onTap={this._onMapTapped}>
                <CustomCalloutView visible={callout.visible}
                                   showAtPoint={callout.point}
                                   title={callout.title} onSave={this._onSavePressed}/>
            </AGSMapView>
            {searchListView}
        </View>
        );
    }

    _onSearchComplete = (results) => {
        this.setState({
            searchData:results
        });
    };


    // List view related ----->
    _renderSearchListView = () => {
        return (
            <View style={styles.searchListContainer}>
                <FlatList
                    data={this.state.searchData}
                    renderItem={this._renderSearchItem}
                    keyExtractor={this._keyExtractor}
                    automaticallyAdjustContentInsets={false}
                />
            </View>
        );
    };

    _keyExtractor = (item, index) => index;

    _renderSearchItem = ({item}) => {
        return(
            <TouchableHighlight onPress={() => this._onSearchItemPress(item)}>
                <Text style={styles.searchItem}>
                    {item.label}
                </Text>
            </TouchableHighlight>
        );
    };


    // Events ----->

    _onSearchItemPress = (searchItem) => {
        AGSLocatorTask.geocodeWithSearchText(searchItem.label)
            .then(this._handleGeocodeSuccess)
            .catch(this._handleGeocodeFailure);
    };

    _handleGeocodeSuccess = (results) => {
        let topResult = results[0];
        this.setState({
            viewPointCenter:topResult.displayLocation,
            searchData:null,
            callout: {
                visible:true,
                point:topResult.displayLocation,
                title:topResult.label,
            }
        });

        this._addPointOnMap(topResult.displayLocation);
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

    _onIdentifySuccess = (result) => {
        let callout = {};
        if(result.length === 0) {
            callout.visible = false;
        }
        else {
            callout.visible = true;
            callout.point = result[0].geometry;
            callout.title = "Graphic Selected";
        }

        this.setState({
            callout:callout
        });
    };

    _addPointOnMap = (point) => {
        let markerSymbol = AGSSimpleMarkerSymbol.symbol(AGSSimpleMarkerSymbol.Style.Triangle, 'rgba(100,34,255,1)', 10);
        let pointGraphic = {
            geometry:point,
            symbol:markerSymbol
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

    _onSavePressed = (event) => {
        console.log(event);
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
    },
    searchInput:{
        margin:5,
        borderColor: 'lightgray',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10
    },
    searchListContainer:{
        position: 'absolute',
        top:40,
        left:10,
        right:10,
        height: 130,
        backgroundColor:'lightgray'
    },
    searchItem:{
        padding:10,
        marginBottom:2,
        backgroundColor:'whitesmoke'
    }
});
