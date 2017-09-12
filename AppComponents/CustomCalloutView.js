'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    SegmentedControlIOS,
    TouchableOpacity
} from 'react-native';

import CalloutView from '../ArcGISReactComponents/CalloutView';

export default class CustomCalloutView extends Component {

    constructor(props) {
        super(props);
        this.isVisited = false;
        this.isWishlist = false;
        this.state = {
            saveDisabled: true
        };
    }

    render() {
        let {visible, placeData} = this.props;
        let point = placeData ? placeData.locationPoint : null;
        return (
        <CalloutView visible={visible}
                        showAtPoint={point}>
            {this._renderCustomSubview(placeData)}
        </CalloutView>
        );
    }

    _renderCustomSubview = (placeData) => {
        let index = -1;
        let placeName = "";
        if (placeData) {
            if(placeData.isVisited) {
                index = 0;
            }
            else if(placeData.isWishlist) {
                index = 1;
            }
            placeName = placeData.placeName;
        }

        let saveButton = this._renderButton("Save",this.state.saveDisabled,this._saveButtonPressed);
        let flightButton = this.props.isFlightsButtonVisible ? this._renderButton("Show Flight Path",false,this._showFlightPathPressed) : null;
        return(
        <View style={styles.calloutSubview}>
            <Text style={styles.title}> {placeName} </Text>
            <SegmentedControlIOS
                values={["I've been here", "I want to go here"]}
                selectedIndex={index}
                onChange={this._segmentedControlSelectionChanged}
            />
            {flightButton}
            {saveButton}
        </View>
        );
    };

    _renderButton = (title,disabled,onPress) => {
        let buttonTextStyle = [styles.buttonText];
        if (disabled) {
            buttonTextStyle.push(styles.buttonTextDisabled);
        }

        return (
        <TouchableOpacity disabled={disabled}
                          onPress={onPress}
                          underlayColor='blue'>
            <View style={styles.button}>
                <Text style={buttonTextStyle}>{title}</Text>
            </View>
        </TouchableOpacity>
        );
    };



    // EVENTS -->

    _segmentedControlSelectionChanged = (event) => {
        let selectedIndex = event.nativeEvent.selectedSegmentIndex;
        if (selectedIndex < 0) { return; }

        this.isVisited = (selectedIndex === 0);
        this.isWishlist = (selectedIndex === 1);
        this.setState({
            saveDisabled:false,
        });
    };

    _saveButtonPressed = (event) => {
        let {placeData} = this.props;
        placeData.isVisited = this.isVisited;
        placeData.isWishlist = this.isWishlist;
        this.props.onSave && this.props.onSave(placeData);
    };

    _showFlightPathPressed = (event) => {
        this.props.onShowFlightPath && this.props.onShowFlightPath(this.props.placeData);
    };
}

CustomCalloutView.propTypes = {
    placeData:PropTypes.shape({
        isVisited:PropTypes.bool,
        isWishlist:PropTypes.bool,
        placeName:PropTypes.string,
    }),
    isFlightsButtonVisible:PropTypes.bool,
    onSave:PropTypes.func,
    onShowFlightPath:PropTypes.func
};

const styles = StyleSheet.create({
    calloutSubview: {
        width:289,
        height:146,
        padding:10,
    },
    title: {
        marginBottom: 10,
        backgroundColor: 'transparent'
    },
    button: {
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    buttonText: {
        color:'rgb(50,139,249)',
        textAlign: 'center'
    },
    buttonTextDisabled: {
        color: 'gray',
        opacity:0.7
    }
});