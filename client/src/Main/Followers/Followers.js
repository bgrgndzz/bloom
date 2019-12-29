import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';

import jwtDecode from 'jwt-decode';

import api from '../../shared/api';
import User from '../shared/User/User';
import DoubleSelect from '../shared/DoubleSelect/DoubleSelect';

export default class Followers extends Component {
  state = {
    followers: [],
    following: [],
    mutual: [],
    option: 'followers',
    refreshing: false
  }

  listFollowers = () => {
    api(
      {
        path: `user/followers/${this.props.navigation.getParam('user', '')}`,
        method: 'GET',
        jwt: this.props.screenProps.jwt,
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        return this.setState({
          followers: res.followers,
          following: res.following,
          mutual: res.mutual,
          refreshing: false
        });
      }
    );
  }

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        followers: [],
        following: [],
        mutual: []
      },
      this.listFollowers
    );
  }

  onChangeOption = option => this.setState({ option });

  componentDidMount = this.onRefresh;

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.followers}
          contentContainerStyle={styles.followersContent}
          showsVerticalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          data={this.state[this.state.option]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push('Profile', {
                  user: item._id === jwtDecode(this.props.screenProps.jwt).user ? null : item._id,
                  jwt: this.props.screenProps.jwt
                });
              }}
            >
              <User
                user={item}
                search={this.state.search}
              />
            </TouchableOpacity>
          )}
          ListHeaderComponent={(
            <DoubleSelect
              options={{
                followers: `${this.state.followers.length} Takipçi`,
                following: `${this.state.following.length} Takip`,
                mutual: `${this.state.mutual.length} Ortak`
              }}
              option={this.state.option}
              onChangeOption={this.onChangeOption}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  followers: {
    flex: 1
  },
  followersContent: {
    marginTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15
  }
});
