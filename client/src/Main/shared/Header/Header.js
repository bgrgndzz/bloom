import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';

import FontAwesome from '../../../shared/FontAwesome/FontAwesome';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.header}>
        {this.props.navigation.dangerouslyGetParent().state.routes.length > 1 ? (
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
            style={styles.leftIconContainer}
            onPress={() => this.props.navigation.push('Notifications')}
          >
            <FontAwesome
              style={styles.icon}
              icon="bell"
            />
            {this.props.notifications ? (
              <View style={styles.notificationCountContainer}>
                <Text style={styles.notificationCount}>{this.props.notifications}</Text>
              </View>
            ) : null}

          </TouchableOpacity>
        )}
        <Image
          style={styles.logo}
          source={require('../../../images/logo.png')}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={() => this.props.navigation.push(this.props.navigation.state.routeName === 'Profile' ? 'Settings' : 'CreateTopic')}
        >
          <FontAwesome
            style={styles.icon}
            icon={this.props.navigation.state.routeName === 'Profile' ? 'cog' : 'plus'}
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
    fontSize: 25
  },
  notificationCountContainer: {
    width: 15,
    height: 15,
    borderRadius: 10,
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EA3546',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationCount: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '900'
  }
});
