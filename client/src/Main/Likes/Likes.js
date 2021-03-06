import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Text
} from 'react-native';

import jwtDecode from 'jwt-decode';

import api from '../../shared/api';
import User from '../shared/User/User';

export default class Likes extends Component {
  state = {
    likes: [],
    refreshing: false
  }

  listLikes = () => {
    api(
      {
        path: `post/likes/${this.props.navigation.getParam('post', '')}`,
        method: 'GET',
        jwt: this.props.screenProps.jwt,
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        return this.setState({
          likes: res.likes,
          refreshing: false
        });
      }
    );
  }

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        likes: []
      },
      this.listLikes
    );
  }

  componentDidMount = this.onRefresh;

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.likes}
          contentContainerStyle={styles.likesContent}
          showsVerticalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          data={this.state.likes}
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
            <Text style={styles.likesHeading}>Beğenenler</Text>
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
  likes: {
    flex: 1
  },
  likesContent: {
    marginTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  likesHeading: {
    fontSize: 25,
    fontWeight: '900',
    color: '#16425B',
    marginBottom: 15,
    textAlign: 'center'
  },
});
