import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  TouchableOpacity
} from 'react-native';

import {NavigationActions} from 'react-navigation';

import FontAwesome from '../../../shared/FontAwesome/FontAwesome';

const pages = {
  Feed: 'home',
  Topics: 'compass',
  Profile: 'user-circle',
  Settings: 'bars'
}
export default class BottomNavigation extends Component {
  render() {
    const routeName = this.props.navigation.state.routeName;
    const jwt = this.props.navigation.getParam('jwt', '');

    return (
      <View style={styles.bottomNavigation}>
        {Object.keys(pages).map(page => (
          <TouchableOpacity
            style={[styles.navItem, routeName === page && styles.activeNavItem]}
            onPress={() => {this.props.navigation.reset([NavigationActions.navigate({routeName: page, params: {jwt}})], 0)}}
            key={page}
          >
            <FontAwesome 
              style={[styles.navIcon, routeName === page && styles.activeNavIcon]}
              icon={pages[page]}
            />
          </TouchableOpacity>
        ))}
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
