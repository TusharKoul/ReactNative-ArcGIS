import React from 'react';
import PropTypes from 'prop-types';

import {
    requireNativeComponent,
    NativeModules,
    findNodeHandle
} from 'react-native';

// If a module named RCTMyClassName is exported from Objc
// it'll be imported as MyClassName from NativeModules
// here RCTMapViewManager was exported
const { MapViewManager } = NativeModules;

class MapView extends React.Component {

    constructor(props) {
        super(props);
        this._onTap= this._onTap.bind(this);
    }

    render() {
        return (
        <RCTMapView
            {...this.props}
            onTap={this._onTap}
        />
        );
    }

    addGraphics(graphics) {
        console.log(NativeModules);
        MapViewManager.addGraphics(findNodeHandle(this),graphics);
    }

    // method returns a Promise
    identifyGraphicsOverlays(screenPoint, tolerance, returnPopupsOnly, maximumResults) {
        return MapViewManager.identifyGraphicsOverlays(findNodeHandle(this), screenPoint, tolerance, returnPopupsOnly, maximumResults);
    }

    _onTap(event: Event) {
        if (!this.props.onTap) { return; }
        this.props.onTap(event.nativeEvent);
    }
}

const PointProp = PropTypes.shape({
    x:PropTypes.number.isRequired,
    y:PropTypes.number.isRequired,
    spatialReference:PropTypes.shape({
        wkid:PropTypes.number
    }).isRequired
});

MapView.propTypes = {
    viewPointCenter: PointProp,
    onTap:PropTypes.func
};

// RCTMapView is generated from RCTMapViewManager which is defined in Objective C
let RCTMapView = requireNativeComponent('RCTMapView',MapView);
module.exports = MapView;
