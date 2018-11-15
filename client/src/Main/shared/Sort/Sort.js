import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity
} from 'react-native';

export default class Sort extends Component {
  render() {
    const sortOptions = this.props.sortOptions || {
      popular: 'Popüler',
      new: 'Yeni'
    };

    return (
      <View style={styles.sortContainer}>
        {Object.keys(sortOptions).map(sortOption => (
          <TouchableOpacity 
            style={this.props.sort === sortOption ? styles.activeSort : styles.sort}
            onPress={() => this.props.sortFunction(sortOption)}
            key={sortOption}
          >
            <Text style={this.props.sort === sortOption ? styles.activeSortText : styles.sortText}>{sortOptions[sortOption]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sort: {
    width: '45%',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1,
  },
  activeSort: {
    width: '45%',
    backgroundColor: '#16425B',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1,
  },
  sortText: {
    color: 'rgba(0, 0, 0, 0.75)',
    textAlign: 'center',
    fontSize: 15
  },
  activeSortText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15
  }
});
