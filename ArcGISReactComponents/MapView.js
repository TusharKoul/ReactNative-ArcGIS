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
        this._native = null;
        this._onNativeComponentMount= this._onNativeComponentMount.bind(this);
        this._onTap= this._onTap.bind(this);
    }

    // called when native component mounts, not exposed as a part of React native
    _onNativeComponentMount(ref) {
        if (this._native === ref) { return; }
        this._native = ref;
        MapViewManager.changeGraphicsOverlays(findNodeHandle(this),this.props.graphicsOverlays,null);
    }

    componentWillUnmount() {
        this._native = null;
    }

    render() {
        return (
        <RCTMapView
            {...this.props}
            ref={this._onNativeComponentMount}
            onTap={this._onTap}
        />
        );
    }

    addGraphics(graphics) {
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

    componentWillReceiveProps(newProps) {
        // No change in graphicsOverlays
        if (this.props.graphicsOverlays === newProps.graphicsOverlays) {
            return;
        }

        let newOverlays = newProps.graphicsOverlays;
        let oldOverlays = this.props.graphicsOverlays;
        let addOrUpdateOverlays = {};
        let removeOverlays = [];
        let existingKey = {};

        for(let key in newOverlays) {
            if(oldOverlays[key] !== newOverlays[key]) {
                addOrUpdateOverlays[key] = newOverlays[key];
            }
            existingKey[key] = true;
        }

        for(let key in oldOverlays) {
            if(!existingKey[key]) {
                removeOverlays.push(key);
            }
        }

        MapViewManager.changeGraphicsOverlays(findNodeHandle(this),addOrUpdateOverlays,removeOverlays);
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
    onTap:PropTypes.func,
    graphicsOverlays:PropTypes.object
};

// RCTMapView is generated from RCTMapViewManager which is defined in Objective C
let RCTMapView = requireNativeComponent('RCTMapView',MapView);
module.exports = MapView;
