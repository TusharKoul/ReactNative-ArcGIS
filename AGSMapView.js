import React from 'react';
import PropTypes from 'prop-types';

import {
    requireNativeComponent,
    NativeModules,
    findNodeHandle
} from 'react-native';

const { ARNMapViewManager } = NativeModules;

class AGSMapView extends React.Component {
    render() {
        console.log('rendering AGSMapview');
        return (
        <ARNMapView {...this.props}/>
        );
    }

    addGraphics(graphics) {
        ARNMapViewManager.addGraphics(findNodeHandle(this),graphics);
    }
}

AGSMapView.propTypes = {
    viewPointCenter: PropTypes.shape({
        x:PropTypes.number.isRequired,
        y:PropTypes.number.isRequired,
        spatialReference:PropTypes.shape({
            wkid:PropTypes.number
        })
    }),
    graphics: PropTypes.arrayOf(PropTypes.shape({
        id:PropTypes.string.isRequired,
        isVisible:PropTypes.bool,
        isSelected:PropTypes.bool,
        symbol:PropTypes.shape({
            type:PropTypes.string.isRequired,
            color:PropTypes.string.isRequired,
            style:PropTypes.string.isRequired,
            size:PropTypes.number.isRequired,
        }),
        coordinates:PropTypes.arrayOf(PropTypes.shape({
            x:PropTypes.number.isRequired,
            y:PropTypes.number.isRequired,
        })),
        spatialReference:PropTypes.shape({
            wkid:PropTypes.number
        })
    }))
};

// ARNMapView is generated from ARNMapViewManager which is defined in Objective C
let ARNMapView = requireNativeComponent('ARNMapView',AGSMapView);
module.exports = AGSMapView;
