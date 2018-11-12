import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { CachedImage } from 'react-native-cached-image';

export default class Post extends Component {
  render() {
    return (
      <View style={styles.post}>
        {this.props.include.includes('user') && (
          <View style={styles.top}>
            <TouchableOpacity 
              style={styles.authorContainer}
              onPress={() => this.props.changePage('Profile', {user: this.props.userId})}
            >
              <CachedImage 
                style={styles.profilepicture}
                source={this.props.profilepicture ? {uri: this.props.profilepicture} : require('../../../images/defaultprofile.png')}
              />
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
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profilepicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  author: {
    fontWeight: '700',
    color: '#505050'
  },
  topic: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 5,
    color: 'rgba(0, 0, 0, 0.75)'
  },
  text: {
    fontWeight: '100'
  }
});