import React from 'react';
import PropTypes from 'prop-types';

import {
    requireNativeComponent,
} from 'react-native';

class CalloutView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <RCTCalloutView
                {...this.props}
            />
        );
    }
}

CalloutView.propTypes = {
    visible:PropTypes.bool.isRequired,
    title:PropTypes.string,
    detail:PropTypes.string,
    showAtPoint: PropTypes.shape({
        x:PropTypes.number.isRequired,
        y:PropTypes.number.isRequired,
        spatialReference:PropTypes.shape({
            wkid:PropTypes.number
        }).isRequired
    })
};

// RCTCalloutView is generated from RCTCalloutViewManager which is defined in Objective C
let RCTCalloutView = requireNativeComponent('RCTCalloutView',CalloutView);
module.exports = CalloutView;