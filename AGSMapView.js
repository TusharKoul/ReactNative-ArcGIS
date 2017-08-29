import React from 'react';

import { requireNativeComponent } from 'react-native';


class AGSMapView extends React.Component {
    render() {
        return (
        <ARNMapView {...this.props}/>
        );
    }
}

AGSMapView.propTypes = {

};

// ARNMapView is generated from ARNMapViewManager which is defined in Objective C
let ARNMapView = requireNativeComponent('ARNMapView',AGSMapView);
module.exports = AGSMapView;
