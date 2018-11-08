import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import FontAwesome from '../../../shared/FontAwesome/FontAwesome';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.header}>
        <Image 
          style={styles.logo}
          source={require('../../../images/logo.png')}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => this.props.changePage('Feed')}>
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
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: 35,
    marginLeft: 70,
    marginRight: 'auto'
  },
  newTopic: {
    color: 'white',
    fontFamily: 'FontAwesome5FreeRegular',
    fontSize: 25,
    marginLeft: 'auto',
    marginRight: 20
  }
});