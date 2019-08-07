import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';

import Post from '../shared/Post/Post';
import Comment from '../shared/Comment/Comment';
import Input from '../../shared/Input/Input';
import Button from '../../shared/Button/Button';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';

import api from '../../shared/api';

export default class Comments extends Component {
  state = {
    post: {},
    comments: [],
    comment: '',
    refreshing: false,
    anonymous: false,
  }

  reportCallback = () => this.props.navigation.goBack();

  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      api(
        {
          path: `post/comments/${this.props.navigation.getParam('post', '')}`,
          method: 'GET',
          jwt: this.props.screenProps.jwt
        },
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.logout();
            return Alert.alert(err);
          }

          this.setState({
            comments: res.comments,
            post: res.post,
            refreshing: false
          });
        }
      );
    });
  }

  onPress = () => {
    api(
      {
        path: `post/comment/${this.props.navigation.getParam('post', '')}`,
        method: 'POST',
        jwt: this.props.screenProps.jwt,
        body: {
          text: this.state.comment,
          anonymous: this.state.anonymous
        }
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        this.setState({ comment: '' }, this.onRefresh);
      }
    );
  }

  onChangeText = comment => this.setState({ comment });

  componentDidMount = this.onRefresh;

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.comments}
          contentContainerStyle={styles.commentsContent}
          showsVerticalScrollIndicator={false}
          refreshControl={(
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          )}
        >
          {Object.keys(this.state.post).length > 0 && (
            <Post
              {...this.state.post}
              {...this.props}
              include={['user', 'topic']}
              navigation={this.props.navigation}
              logout={this.props.logout}
              reportCallback={this.reportCallback}
            />
          )}
          <View style={styles.form}>
            <Input
              placeholder="Bir yorum yap"
              multiline
              onChangeText={this.onChangeText}
              value={this.state.comment}
              containerStyle={{ marginBottom: 15 }}
            />
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => this.setState({anonymous: !this.state.anonymous})}
            >
              <View style={[styles.checkbox, this.state.anonymous ? styles.checkboxActive : styles.checkboxInactive]}>
                {this.state.anonymous && (
                  <FontAwesome
                    style={styles.checkboxIcon}
                    icon="check"
                  />
                )}
              </View>
              <Text style={styles.checkboxText}>Anonim</Text>
            </TouchableOpacity>
            <Button
              text="Yorum Yap"
              onPress={this.onPress}
            />
          </View>
          {this.state.comments.map(comment => (
            <Comment
              key={comment._id}
              {...comment}
              {...this.props}
              navigation={this.props.navigation}
              logout={this.props.logout}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15
  },
  comments: {
    flex: 1
  },
  commentsContent: {
    marginTop: 15,
    paddingBottom: 15
  },
  topicContainer: {
    elevation: 2
  },
  topic: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },
  topicName: {
    color: '#202020',
    fontWeight: '100',
    textAlign: 'center'
  },
  form: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },
  checkboxContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxActive: {
    backgroundColor: '#16425B',
  },
  checkboxInactive: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  checkboxIcon: {
    color: 'white',
    fontSize: 12.5
  }
});
