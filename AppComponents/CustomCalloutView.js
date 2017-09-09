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

import AGSCalloutView from '../ArcGISReactComponents/AGSCalloutView';

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
        <AGSCalloutView visible={visible}
                        showAtPoint={point}>
            {this._renderCustomSubview(placeData)}
        </AGSCalloutView>
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

        return(
        <View style={styles.calloutSubview}>
            <Text style={styles.title}> {placeName} </Text>
            <SegmentedControlIOS
                values={["I've been here", "I want to go here"]}
                selectedIndex={index}
                onChange={this._segmentedControlSelectionChanged}
            />
            {this._renderButton()}
        </View>
        );
    };

    _renderButton = () => {
        let {saveDisabled} = this.state;
        let buttonTextStyle = [styles.buttonText];
        if (saveDisabled) {
            buttonTextStyle.push(styles.buttonTextDisabled);
        }

        return (
        <TouchableOpacity disabled={saveDisabled}
                          onPress={this._saveButtonPressed}
                          underlayColor='blue'>
            <View style={styles.button}>
                <Text style={buttonTextStyle}>Save</Text>
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
        this.props.onSave(placeData);
    };
}

CustomCalloutView.propTypes = {
    placeData:PropTypes.shape({
        isVisited:PropTypes.bool,
        isWishlist:PropTypes.bool,
        placeName:PropTypes.string,
    }),
    onSave:PropTypes.func
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