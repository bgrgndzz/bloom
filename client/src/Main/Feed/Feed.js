import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text,
  Alert
} from 'react-native';

import Topic from '../shared/Topic/Topic';

import listTopics from './api/listTopics';

export default class Feed extends Component {
  state = {topics: []}

  componentWillMount = () => {
    listTopics(this.props.jwt, (err, res) => {
      if (err && !res) return Alert.alert(err);
      this.setState({topics: res.topics});
    });
  }

  render() {
    return (
      <View style={styles.topics}>
        {this.state.topics.map((topic, index) => (
          <Topic
            key={index}
            topic={topic.topic}
            posts={topic.posts}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topics: {
    padding: 15
  }
});