import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import FontAwesome from '../../../shared/FontAwesome/FontAwesome';

const pages = {
  Feed: 'home',
  Topics: 'bookmark',
  Profile: 'user',
  Messages: 'envelope'
};

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
  },
  messageCountContainer: {
    width: 15,
    height: 15,
    borderRadius: 10,
    position: 'absolute',
    top: 7.5,
    right: 7.5,
    backgroundColor: '#EA3546',
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageCount: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '900'
  }
});

const BottomNavigation = props => (
  <View style={styles.bottomNavigation}>
    {Object.keys(pages).map(page => (
      <TouchableOpacity
        style={[
          styles.navItem,
          props.navigation.state.routeName === page && styles.activeNavItem
        ]}
        onPress={() => props.navigation.reset([NavigationActions.navigate({ routeName: page })], 0)}
        key={page}
      >
        <FontAwesome
          style={[
            styles.navIcon,
            props.navigation.state.routeName === page && styles.activeNavIcon
          ]}
          icon={pages[page]}
        />
        {(props.messages && page === 'Messages') ? (
          <View style={styles.messageCountContainer}>
            <Text style={styles.messageCount}>{props.messages}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    ))}
  </View>
);

export default BottomNavigation;
