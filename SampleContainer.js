'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    FlatList,
    Text
} from 'react-native';

import AGSMapView from './AGSMapView';

const rows = [
    {id: 0, text: 'Place 1'},
    {id: 1, text: 'Place 2'},
    {id: 2, text: 'Place 3'},
    {id: 3, text: 'Place 4'},
];


export default class SampleContainer extends Component {

    constructor(props) {
        super(props);

        // typingTimeout isn't directly responsible for manipulating UI,
        // hence it's not part of the state, rather its a member of the class
        this.typingTimeout = 0;
        this.state = {
            searchData: null
        };
    }

    render() {
        let {searchData} = this.state;
        let searchListView = (searchData) ? this._renderSearchListView() : null;
        return (
        <View style={styles.container}>
            <TextInput  style={styles.searchInput}
                        placeholder='Search for place'
                        onChangeText={this._onSearchTextChange} />
            <AGSMapView style={styles.map}/>
            {searchListView}
        </View>
        );
    }

    _onSearchTextChange = (text) => {
        if(this.typingTimeout) {
            console.log('clearing timeout');
            clearTimeout(this.typingTimeout);
        }

        // search after 1 sec of typing
        this.typingTimeout = setTimeout(()=> {
            this._fetchPlaceSuggestions(text);
        },1000);
    };

    _fetchPlaceSuggestions = (text) => {
        if(text.trim()) {
            //call fetch here
            console.log('Fire search function with ' + text);
            this.setState({
                searchData:rows
            });
        }
        else {
            this.setState({
                searchData:null
            });
        }
    };

    _renderSearchListView = () => {
        return (
        <View style={styles.searchListContainer}>
            <FlatList
                style={styles.searchList}
                data={rows}
                renderItem={this._renderSearchItem}
                keyExtractor={this._keyExtractor}
                automaticallyAdjustContentInsets={false}
            />
        </View>
        );
    };

    _keyExtractor = (item, index) => item.id;

    _renderSearchItem = ({item}) => {
        console.log(item);
        return(
        <Text style={styles.searchItem}>
            {item.text}
        </Text>
        );
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
    },
    searchListContainer:{
        position: 'absolute',
        top:40,
        left:10,
        right:10,
        height: 130,
        backgroundColor:'lightgray'
    },
    searchItem:{
        padding:10,
        marginBottom:2,
        backgroundColor:'whitesmoke'
    }
});
