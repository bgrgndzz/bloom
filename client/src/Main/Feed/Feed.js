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
      this.props.jwt,
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.goHome();
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
              jwt={this.props.jwt}
              changePage={this.props.changePage}
              goHome={this.props.goHome}
            />
          ))}
        </ScrollView>
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
  }
});