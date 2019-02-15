import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Alert,
  ActivityIndicator
} from 'react-native';

import Post from '../shared/Post/Post';

import api from '../../shared/api';

export default class Feed extends Component {
  state = {
    posts: [],
    page: 1,
    refreshing: false,
    dataEnd: false,
    dataLoading: false
  }

  listFeedPosts = (state = {}) => {
    const jwt = this.props.navigation.getParam('jwt', '');
    const { page, posts } = this.state;
    api(
      {
        path: `posts/list/feed/${page}`,
        method: 'GET',
        jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        this.setState({
          ...state,
          posts: posts.concat(res.posts),
          dataEnd: res.posts.length < 10,
          dataLoading: false
        });
      }
    );
  }
  onRefresh = () => {
    this.setState({
      refreshing: true,
      dataEnd: false,
      posts: [],
      page: 1
    }, () => {
      this.listFeedPosts({refreshing: false});
    });
  }

  componentWillMount = this.onRefresh;

  render() {
    const { posts, refreshing, page, dataEnd, dataLoading } = this.state;
    const { navigation, logout } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.posts}
          contentContainerStyle={styles.postsContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Post
              {...item}
              include={['user', 'topic']}
              navigation={navigation}
              logout={logout}
            />
          )}
          onScroll={e => {
            const event = e.nativeEvent
            const currentOffset = event.contentOffset.y;
            this.direction = currentOffset > this.offset ? 'down' : 'up';
            this.offset = currentOffset;

            if (
              event.contentOffset.y >= event.contentSize.height - event.layoutMeasurement.height * 1.25 &&
              !dataLoading &&
              !dataEnd &&
              this.direction === 'down' &&
              this.offset > 0
            ) {
              this.setState({
                dataLoading: true,
                page: page + 1
              }, this.listFeedPosts);
            }
          }}
          ListFooterComponent={
            <ActivityIndicator
              style={styles.loading}
              animating={dataLoading}
            />
          }
        />
        {posts.length === 0 && !refreshing && (
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
    flex: 1
  },
  postsContent: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 15
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
  },
  loading: {
    marginBottom: 15
  }
});
