import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text,
  ScrollView
} from 'react-native';

import Header from './shared/Header/Header.js';
import BottomNavigation from './shared/BottomNavigation/BottomNavigation.js';

import Feed from './Feed/Feed.js';

export default class Main extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header />
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Feed jwt={this.props.jwt} />
        </ScrollView>
        <BottomNavigation />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  }
});
