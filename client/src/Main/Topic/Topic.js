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
import Input from '../../shared/Input/Input';
import Button from '../../shared/Button/Button';

import listPosts from './api/listPosts';
import createPost from './api/createPost';

export default class Topic extends Component {
  state = {
    posts: [],
    refreshing: false,
    post: ''
  }

  componentWillMount = () => {
    listPosts(
      this.props.jwt, 
      this.props.topic, 
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.goHome();
          return Alert.alert(err);
        }
        this.setState({posts: res.posts});
      }
    );
  }
  
  onRefresh = () => {
    this.setState({refreshing: true});
    listPosts(
      this.props.jwt, 
      this.props.topic, 
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.goHome();
          return Alert.alert(err);
        }
        this.setState({
          posts: res.posts,
          refreshing: false
        });
      }
    );
  }
  onChangeText = (post) => {
    this.setState({post})
  }
  onPress = () => {
    createPost(
      this.props.jwt, 
      this.props.topic, 
      {text: this.state.post},
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.goHome();
          return Alert.alert(err);
        }

        listPosts(
          this.props.jwt, 
          this.props.topic, 
          (err, res) => {
            if (err && !res) {
              if (err === 'unauthenticated') return this.props.goHome();
              return Alert.alert(err);
            }
            this.setState({posts: res.posts});
          }
        );
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.posts}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={styles.controls}>
            <View style={styles.topic}>
              <TouchableOpacity
                style={styles.backButtonContainer}
                onPress={() => this.props.changePage('Feed')}
              >
                <Image 
                  style={styles.backButton}
                  resizeMode="contain"
                  source={require('../../images/back--black.png')}
                />
              </TouchableOpacity>
              <Text style={styles.topicName}>{this.props.topic}</Text>
            </View>
            <View style={styles.form}>
              <Input 
                placeholder="Fikrini paylaş"
                multiline={true}
                onChangeText={this.onChangeText}
                value={this.state.post}
                containerStyle={{marginBottom: 15}}
              />
              <Button 
                text="Paylaş"
                onPress={this.onPress}
              />
            </View>
          </View>
          {this.state.posts.map((post, index) => (
            <Post 
              key={index}
              text={post.text}
              firstName={post.author.firstName}
              lastName={post.author.lastName}
              userId={post.author.id}
              include={['user']}
              changePage={this.props.changePage}
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
    padding: 15,
  },
  controls: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1
  },
  topic: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center'
  },
  topicName: {
    flex: 1,
    color: '#202020',
    fontWeight: '100'
  },
  postsCount: {
    width: '15%',
    textAlign: 'right',
    color: '#707070',
    fontWeight: '500'
  },
  form: {
    padding: 15
  },
  backButtonContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12.5
  },
  backButton: {
    width: 12.5,
    height: 12.5
  }
});