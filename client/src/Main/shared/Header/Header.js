import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import {CachedImage} from 'react-native-cached-image';

import FontAwesome from '../../../shared/FontAwesome/FontAwesome';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.temp]}
        >
          <FontAwesome 
            style={styles.newTopic}
            icon="plus"
          />
        </TouchableOpacity>
        <CachedImage 
          style={styles.logo}
          source={require('../../../images/logo.png')}
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={styles.newTopicContainer}
          onPress={() => this.props.changePage('CreateTopic')}
        >
          <FontAwesome 
            style={styles.newTopic}
            icon="plus"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#16425B',
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  temp: {
    opacity: 0,
    marginRight: 'auto',
    marginLeft: 20
  },
  logo: {
    height: 35,
    marginHorizontal: 'auto'
  },
  newTopicContainer: {
    marginLeft: 'auto',
    marginRight: 20
  },
  newTopic: {
    color: 'white',
    fontFamily: 'FontAwesome5FreeRegular',
    fontSize: 25
  }
});