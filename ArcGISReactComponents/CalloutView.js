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
            <ARNCalloutView
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

// ARNCalloutView is generated from ARNCalloutViewManager which is defined in Objective C
let ARNCalloutView = requireNativeComponent('ARNCalloutView',CalloutView);
module.exports = CalloutView;

//AGSPoint: (-117.196000, 34.057000), sr: 4326
