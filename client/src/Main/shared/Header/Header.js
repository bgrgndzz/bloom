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
        {this.props.navigation.getParam('back', '') ? (
          <TouchableOpacity 
            style={styles.leftIconContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <FontAwesome 
              style={styles.icon}
              icon="chevronLeft"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.leftIconContainer, styles.temp]}
            onPress={() => {}}
          >
            <FontAwesome 
              style={styles.icon}
              icon="plus"
            />
          </TouchableOpacity>
        )}
        <Image 
          style={styles.logo}
          source={require('../../../images/logo.png')}
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={styles.rightIconContainer}
          onPress={() => this.props.navigation.navigate('CreateTopic', {jwt: this.props.navigation.getParam('jwt', ''), back: true})}
        >
          <FontAwesome 
            style={styles.icon}
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
  leftIconContainer: {
    marginRight: 'auto',
    marginLeft: 20
  },
  temp: {
    opacity: 0
  },
  logo: {
    height: 35,
    marginHorizontal: 'auto'
  },
  rightIconContainer: {
    marginLeft: 'auto',
    marginRight: 20
  },
  icon: {
    color: 'white',
    fontFamily: 'FontAwesome5FreeRegular',
    fontSize: 25
  }
});