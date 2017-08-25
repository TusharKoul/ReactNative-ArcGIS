'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

import AGSMapView from './AGSMapView';

export default class SampleContainer extends Component {
    render() {
        return (
        <View style={styles.container}>
            <AGSMapView style={styles.map}/>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 20,
        marginTop: 65,
        backgroundColor: 'skyblue'
    },
    map:{
        flex:1,
        backgroundColor: 'green'
    }
});
