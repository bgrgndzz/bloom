import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';

import FontAwesome from '../../../shared/FontAwesome/FontAwesome';

export default class BottomNavigation extends Component {
  render() {
    return (
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navItem, this.props.page === 'Feed' && styles.activeNavItem]}
          onPress={() => this.props.changePage('Feed')}
        >
          <FontAwesome
            style={[styles.navIcon, this.props.page === 'Feed' && styles.activeNavIcon]}
            icon="home"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, this.props.page === 'Profile' && styles.activeNavItem]}
          onPress={() => this.props.changePage('Profile', {user: 'self'})}
        >
          <FontAwesome
            style={[styles.navIcon, this.props.page === 'Profile' && styles.activeNavIcon]}
            icon="user"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, this.props.page === 'Settings' && styles.activeNavItem]}
          onPress={() => this.props.changePage('Settings', {user: 'self'})}
        >
          <FontAwesome
            style={[styles.navIcon, this.props.page === 'Settings' && styles.activeNavIcon]}
            icon="cog"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomNavigation: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  navItem: {
    justifyContent: 'center',
    height: 50,
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeNavItem: {
    backgroundColor: '#16425B'
  },
  navIcon: {
    fontSize: 25,
    color: '#16425B',
  },
  activeNavIcon: {
    color: 'white'
  },
  navTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#16425B',
    fontWeight: '500'
  }
});
