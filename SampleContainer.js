'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
} from 'react-native';

import AGSMapView from './AGSMapView';

export default class SampleContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            typingTimeout: 0
        };
    }

    render() {
        return (
        <View style={styles.container}>
            <TextInput  style={styles.searchInput}
                        placeholder='Search for place'
                        onChangeText={this.onSearchTextChange} />
            <AGSMapView style={styles.map}/>
        </View>
        );
    }

    onSearchTextChange = (text) => {
        let {typingTimeout} = this.state;
        if(typingTimeout) {
            console.log('clearing timeout');
            clearTimeout(typingTimeout);
        }

        // search after 1 sec of typing
        let timeout = setTimeout(()=> {
            console.log('Fire search function with ' + text);
        },1000);

        this.setState({
            typingTimeout: timeout
        });

    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: 65,
        backgroundColor: 'gray'
    },
    map:{
        flex:1
    },
    searchInput:{
        margin:5,
        borderColor: 'lightgray',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10
    }
});
