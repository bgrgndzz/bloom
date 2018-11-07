import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text,
  TouchableOpacity
} from 'react-native';

export default class Post extends Component {
  render() {
    return (
      <View style={styles.post}>
        {this.props.include.includes('user') && (
          <View style={styles.top}>
            <TouchableOpacity onPress={() => this.props.changePage('Profile', {user: this.props.userId})}>
              <Text style={styles.author}>{this.props.firstName} {this.props.lastName}</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.main}>
          {this.props.include.includes('topic') && (
            <Text style={styles.topic}>{this.props.topic}</Text>
          )}
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