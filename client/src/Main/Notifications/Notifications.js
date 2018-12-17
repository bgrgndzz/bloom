import React, {Component} from 'react';
import {
  StyleSheet, 
  ScrollView,
  View,
  Text,
  Alert,
  RefreshControl
} from 'react-native';

import Notification from '../shared/Notification/Notification';

import listNotifications from './api/listNotifications';

export default class Notifications extends Component {
  state = {
    notifications: [],
    refreshing: false
  }

  listNotifications = (state = {}) => {
    listNotifications(
      this.props.navigation.getParam('jwt', ''),
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }
        this.setState({
          ...state,
          notifications: res.notifications
        });
      }
    );
  }
  onRefresh = () => {
    this.setState({refreshing: true}, () => {
      this.listNotifications({refreshing: false});
    });
  }

  componentWillMount = this.onRefresh;

  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.notifications}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.state.notifications.map(notification => (
            <Notification 
              key={notification._id}
              {...notification}
              navigation={this.props.navigation}
            />
          ))}
        </ScrollView>
        {this.state.notifications.length === 0 && !this.state.refreshing && (
          <View style={styles.emptyNotificationsContainer}>
            <Text style={styles.emptyNotifications}>Bildirimlerin burada görünür</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  notifications: {
    padding: 15
  },
  emptyNotificationsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyNotifications: {
    fontSize: 20,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)'
  }
});