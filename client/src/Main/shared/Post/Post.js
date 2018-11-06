import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text
} from 'react-native';

export default class Post extends Component {
  render() {
    return (
      <View style={styles.post}>
        <View style={styles.top}>
          <Text style={styles.author}>{this.props.firstName} {this.props.lastName}</Text>
        </View>
        <View style={styles.main}>
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  post: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1
  },
  top: {
    width: '100%',
    padding: 15,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    backgroundColor: '#fcfcfc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  main: {
    width: '100%',
    padding: 15
  },
  author: {
    fontWeight: '700',
    color: '#505050'
  },
  text: {
    fontWeight: '100'
  }
});