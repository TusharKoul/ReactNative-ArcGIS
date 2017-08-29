import React from 'react';
import PropTypes from 'prop-types';

import { requireNativeComponent } from 'react-native';


class AGSMapView extends React.Component {
    render() {
        console.log('rendering AGSMapview');
        return (
        <ARNMapView {...this.props}/>
        );
    }
}

AGSMapView.propTypes = {
    viewPointCenter: PropTypes.shape({
        x:PropTypes.number.isRequired,
        y:PropTypes.number.isRequired,
        spatialReference:PropTypes.shape({
            wkid:PropTypes.number
        })
    })
};

// ARNMapView is generated from ARNMapViewManager which is defined in Objective C
let ARNMapView = requireNativeComponent('ARNMapView',AGSMapView);
module.exports = AGSMapView;
