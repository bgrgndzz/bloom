import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text
} from 'react-native';

export default class Topic extends Component {
  render() {
    return (
      <View style={styles.topic}>
        <Text style={styles.name}>{this.props.topic}</Text>
        <Text style={styles.posts}>{this.props.posts}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topic: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1,
    flexDirection: 'row'
  },
  name: {
    flex: 1,
    color: '#202020',
    fontWeight: '100'
  },
  posts: {
    width: '15%',
    textAlign: 'right',
    color: '#707070',
    fontWeight: '500'
  }
});