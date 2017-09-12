'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    TextInput,
    NativeModules
} from 'react-native';

let {LocatorTask} = NativeModules;
export default class SearchPlaceTextInput extends Component {

    constructor(props) {
        super(props);

        // typingTimeout isn't directly responsible for manipulating UI,
        // hence it's not part of the state, rather its a member of the class
        this.typingTimeout = 0;
    }

    render() {
        return(
        <TextInput style={styles.searchInput}
                   placeholder='Search for place'
                   onChangeText={this._onSearchTextChange}/>
        );
    }

    _onSearchTextChange = (text) => {
        if(this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        // search after 1 sec of typing
        this.typingTimeout = setTimeout(()=> {
            this._fetchPlaceSuggestions(text);
        },500);
    };

    _fetchPlaceSuggestions = (text) => {
        if(text.trim()) {
            let parameters = {
                "maxResults": 5,
                "categories":[
                    "city"
                ]
            };
            LocatorTask.suggestWithSearchTextAndParameters(text,parameters)
                .then(this._handleLocatorSuggestionsSuccess)
                .catch(this._handleLocatorSuggestionsFailure);
        }
        else {
            this._setSearchResults(null);
        }
    };

    _handleLocatorSuggestionsSuccess = (results) => {
        this._setSearchResults(results);
    };

    _handleLocatorSuggestionsFailure = (error) => {
        if(parseInt(error.code) === 1) {
            console.error(error);
        }
        else {
            this._setSearchResults([error.message]);
        }
    };

    _setSearchResults = (searchResults) => {
        this.props.onSearchComplete && this.props.onSearchComplete(searchResults);
    }
}

SearchPlaceTextInput.propTypes = {
    onSearchComplete:PropTypes.func
};

const styles = StyleSheet.create({
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

