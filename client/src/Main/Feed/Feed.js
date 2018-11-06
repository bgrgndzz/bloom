import React, {Component} from 'react';
import {
  StyleSheet, 
  ScrollView,
  Text,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';

import Topic from '../shared/Topic/Topic';

import listTopics from './api/listTopics';

export default class Feed extends Component {
  state = {
    topics: [],
    refreshing: false
  }

  componentWillMount = () => {
    listTopics(this.props.jwt, (err, res) => {
      if (err && !res) {
        if (err === 'unauthenticated') return this.props.goHome();
        return Alert.alert(err);
      }
      this.setState({topics: res.topics});
    });
  }
  
  onRefresh = () => {
    this.setState({refreshing: true});
    listTopics(this.props.jwt, (err, res) => {
      if (err && !res) {
        if (err === 'unauthenticated') return this.props.goHome();
        return Alert.alert(err);
      }
      this.setState({
        topics: res.topics,
        refreshing: false
      });
    });
  }

  render() {
    return (
      <ScrollView 
        style={styles.topics}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        {this.state.topics.map((topic, index) => (
          <TouchableOpacity 
            key={index}
            onPress={() => this.props.changePage('Topic', topic)}
          >
            <Topic
              topic={topic.topic}
              posts={topic.posts}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  topics: {
    padding: 15
  }
});