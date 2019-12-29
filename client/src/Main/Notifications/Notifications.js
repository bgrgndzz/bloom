import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Alert,
  ActivityIndicator
} from 'react-native';

import Notification from '../shared/Notification/Notification';

import api from '../../shared/api';

export default class Notifications extends Component {
  state = {
    notifications: [],
    refreshing: false,
    page: 1,
    dataEnd: false,
    dataLoading: false
  }

  listNotifications = (state = {}) => {
    api(
      {
        path: `notifications/list/${this.state.page}`,
        method: 'GET',
        jwt: this.props.screenProps.jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        return this.setState({
          ...state,
          notifications: this.state.notifications.concat(res.notifications),
          dataEnd: res.notifications.length < 10,
          dataLoading: false
        });
      }
    );
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      dataEnd: false,
      notifications: [],
      page: 1
    }, () => {
      this.listNotifications({ refreshing: false });
    });
  }

  componentWillMount = this.onRefresh;

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.notifications}
          contentContainerStyle={styles.notificationsContent}
          showsVerticalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          data={this.state.notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Notification
              {...item}
              {...this.props}
              navigation={this.props.navigation}
            />
          )}
          onScroll={e => {
            const event = e.nativeEvent;
            const currentOffset = event.contentOffset.y;
            const heightLimit = event.contentSize.height - event.layoutMeasurement.height * 1.25;
            this.direction = currentOffset > this.offset ? 'down' : 'up';
            this.offset = currentOffset;

            if (
              event.contentOffset.y >= heightLimit &&
              !this.state.dataLoading &&
              !this.state.dataEnd &&
              this.direction === 'down' &&
              this.offset > 0
            ) {
              this.setState({
                dataLoading: true,
                page: this.state.page + 1
              }, this.listNotifications);
            }
          }}
          ListFooterComponent={(
            <ActivityIndicator
              style={styles.loading}
              animating={this.state.dataLoading}
            />
          )}
        />
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
    flex: 1
  },
  notificationsContent: {
    marginTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15
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
  },
  loading: {
    marginBottom: 15
  }
});
