'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableHighlight,
} from 'react-native';

export default class SearchResultsListView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {data} = this.props;
        if(data === null) { return null; }

        return (
        <View style={styles.searchListContainer}>
            <FlatList
                data={data}
                renderItem={this._renderSearchItem}
                keyExtractor={this._keyExtractor}
                automaticallyAdjustContentInsets={false}
            />
        </View>
        );
    }

    _keyExtractor = (item, index) => index;

    _renderSearchItem = ({item}) => {
        return(
            <TouchableHighlight onPress={() => this._onSearchItemPress(item)}>
                <Text style={styles.searchItem}>
                    {item.label}
                </Text>
            </TouchableHighlight>
        );
    };

    _onSearchItemPress = (searchItem) => {
        this.props.onSearchItemPress && this.props.onSearchItemPress(searchItem);
    };
}

SearchResultsListView.propTypes = {
    data:PropTypes.array,
    onSearchItemPress:PropTypes.func
};

const styles = StyleSheet.create({
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
