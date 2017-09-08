import React from 'react';
import PropTypes from 'prop-types';

import {
    requireNativeComponent,
} from 'react-native';

class AGSCalloutView extends React.Component {

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

AGSCalloutView.propTypes = {
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
let ARNCalloutView = requireNativeComponent('ARNCalloutView',AGSCalloutView);
module.exports = AGSCalloutView;

//AGSPoint: (-117.196000, 34.057000), sr: 4326
