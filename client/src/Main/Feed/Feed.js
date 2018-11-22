import React, {Component} from 'react';
import {
  StyleSheet, 
  ScrollView,
  View,
  Text,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Image
} from 'react-native';

import Post from '../shared/Post/Post';

import listFeedPosts from './api/listFeedPosts';

export default class Feed extends Component {
  state = {
    posts: [],
    refreshing: false
  }

  listFeedPosts = (state = {}) => {
    listFeedPosts(
      this.props.navigation.getParam('jwt', ''),
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }
        this.setState({
          ...state,
          posts: res.posts
        });
      }
    );
  }
  onRefresh = () => {
    this.setState({refreshing: true}, () => {
      this.listFeedPosts({refreshing: false});
    });
  }

  componentWillMount = this.onRefresh;

  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.posts}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.state.posts.map((post, index) => (
            <Post 
              key={post.id}
              {...post}
              include={['user', 'topic']}
              navigation={this.props.navigation}
              logout={this.props.logout}
            />
          ))}
        </ScrollView>
        {this.state.posts.length === 0 && !this.state.refreshing && (
          <View style={styles.emptyFeedContainer}>
            <Text style={styles.emptyFeed}>Takip ettiklerin burada görünür</Text>
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
  posts: {
    padding: 15
  },
  emptyFeedContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyFeed: {
    fontSize: 20,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)'
  }
});