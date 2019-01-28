import React, {Component} from 'react';
import {
  StyleSheet, 
  FlatList,
  View,
  Text,
  Alert
} from 'react-native';

import Notification from '../shared/Notification/Notification';

import api from '../../shared/api';

export default class Notifications extends Component {
  state = {
    notifications: [],
    refreshing: false,
    page: 1,
    dataEnd: false
  }

  listNotifications = (state = {}) => {
    api(
      {
        path: 'notifications/list/' + this.state.page,
        method: 'GET',
        jwt: this.props.navigation.getParam('jwt', '')
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }
        
        this.setState({
          ...state,
          notifications: this.state.notifications.concat(res.notifications),
          dataEnd: res.notifications.length < 10
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
      this.listNotifications({refreshing: false});
    });
  }
  nextPage = () => {
    if (!this.state.dataEnd && this.direction === 'down' && this.offset > 0) {
      this.setState({
        page: this.state.page + 1
      }, this.listNotifications);
    }
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
          extraData={this.state.refreshing}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Notification 
              key={item._id}
              {...item}
              navigation={this.props.navigation}
            /> 
          )}
          onEndReachedThreshold={0.5}
          onEndReached={this.nextPage}
          onScroll={(event) => {
            const currentOffset = event.nativeEvent.contentOffset.y;
            this.direction = currentOffset > this.offset ? 'down' : 'up';
            this.offset = currentOffset;
          }}
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
  }
});