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
import Sort from '../shared/Sort/Sort';

import listTopics from './api/listTopics';

export default class Topics extends Component {
  state = {
    topics: [],
    sort: 'popular',
    refreshing: false
  }
  
  onRefresh = () => {
    this.setState({refreshing: true}, () => {
      listTopics(this.props.navigation.getParam('jwt', ''), this.state.sort, (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }
        this.setState({
          topics: res.topics,
          refreshing: false
        });
      });
    });
  }
  sort = (sort) => {
    this.setState({sort}, this.onRefresh);
  }

  componentDidMount = this.onRefresh;

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
        <Sort 
          sort={this.state.sort}
          sortFunction={this.sort}
        />
        {this.state.topics.map((topic, index) => (
          <TouchableOpacity 
            key={topic.topic}
            onPress={() => this.props.navigation.navigate('Topic', {topic: topic.topic, jwt: this.props.navigation.getParam('jwt', ''), back: true})}
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