import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

export default class BottomNavigation extends Component {
  render() {
    return (
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navItem, this.props.page === 'Feed' && styles.activeNavItem]}
          onPress={() => this.props.changePage('Feed')}
        >
          <Image 
            style={styles.navIcon}
            resizeMode="contain"
            source={require('../../../images/feed.png')}
          />
          <Text style={styles.navTitle}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, this.props.page === 'Profile' && styles.activeNavItem]}
          onPress={() => this.props.changePage('Profile')}
        >
          <Image 
            style={styles.navIcon}
            resizeMode="contain"
            source={require('../../../images/profile.png')}
          />
          <Text style={styles.navTitle}>Profile</Text>
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
    justifyContent: 'center'
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#16425B',
    marginTop: 2
  },
  navIcon: {
    width: 'auto',
    height: 20,
    marginBottom: 2.5
  },
  navTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#16425B',
    fontWeight: '500'
  }
});