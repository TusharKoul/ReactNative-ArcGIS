'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import AGSCalloutView from './ArcGISReactComponents/AGSCalloutView';

class CustomCalloutView extends Component {

    _renderCustomSubview = (title) => {
        return(
        <View style={styles.calloutSubview}>
            <Text> {title} </Text>
        </View>
        );
    };

    render() {
        let {visible, showAtPoint, title} = this.props;
        return (
        <AGSCalloutView visible={visible}
                        showAtPoint={showAtPoint}>
            {this._renderCustomSubview(title)}
        </AGSCalloutView>
        );
    }
}

CustomCalloutView.propTypes = {
    ...AGSCalloutView.propTypes,
};


const styles = StyleSheet.create({
    calloutSubview: {
        width:120,
        height:120,
        padding:5,
        backgroundColor: 'red'
    },
});

module.exports = CustomCalloutView;