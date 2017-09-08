import React from 'react';
import PropTypes from 'prop-types';

import {
    requireNativeComponent,
    NativeModules,
    findNodeHandle
} from 'react-native';

const { ARNMapViewManager } = NativeModules;

class AGSMapView extends React.Component {

    constructor(props) {
        super(props);
        this._onTap= this._onTap.bind(this);
    }

    render() {
        return (
        <ARNMapView
            {...this.props}
            onTap={this._onTap}
        />
        );
    }

    addGraphics(graphics) {
        ARNMapViewManager.addGraphics(findNodeHandle(this),graphics);
    }

    // method returns a Promise
    identifyGraphicsOverlays(screenPoint, tolerance, returnPopupsOnly, maximumResults) {
        return ARNMapViewManager.identifyGraphicsOverlays(findNodeHandle(this), screenPoint, tolerance, returnPopupsOnly, maximumResults);
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
    })
});

AGSMapView.propTypes = {
    viewPointCenter: PointProp,
    onTap:PropTypes.func
};

// ARNMapView is generated from ARNMapViewManager which is defined in Objective C
let ARNMapView = requireNativeComponent('ARNMapView',AGSMapView);
module.exports = AGSMapView;
