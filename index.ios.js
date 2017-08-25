/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS
} from 'react-native';

import SampleContainer from './SampleContainer'

export default class ArcGISReactSample extends Component {

    render() {
        return (
            <NavigatorIOS
                style = {styles.container}
                initialRoute = {{
                    title: 'ArcGIS RN Sample',
                    component: SampleContainer
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1
  }
});

AppRegistry.registerComponent('ArcGISReactSample', () => ArcGISReactSample);
