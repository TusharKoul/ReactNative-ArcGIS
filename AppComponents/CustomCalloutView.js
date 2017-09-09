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
        this.state = {
            saveDisabled: true
        };
    }

    render() {
        let {visible, showAtPoint, title} = this.props;
        return (
        <AGSCalloutView visible={visible}
                        showAtPoint={showAtPoint}>
            {this._renderCustomSubview(title)}
        </AGSCalloutView>
        );
    }

    _renderCustomSubview = (title) => {
        return(
        <View style={styles.calloutSubview}>
            <Text style={styles.title}> {title} </Text>
            <SegmentedControlIOS
                values={["I've been here", "I want to go here"]}
                selectedIndex={-1}
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
        this.setState({
            saveDisabled:false
        });
    };

    _saveButtonPressed = (event) => {
        this.props.onSave(event);
    };
}

CustomCalloutView.propTypes = {
    ...AGSCalloutView.propTypes,
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