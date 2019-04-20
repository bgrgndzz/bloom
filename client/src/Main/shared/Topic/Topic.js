import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

const highlight = (string, search) => string && string.split(new RegExp(search, 'gi')).map((splitName, index, array) => [
  (
    <Text
      style={styles.normal}
      key="normal"
    >
      {splitName}
    </Text>
  ),
  index === array.length - 1 ? null : (
    <Text
      style={styles.highlighted}
      key="higlighted"
    >
      {string.match(new RegExp(search, 'gi'))[index]}
    </Text>
  )
]);

const styles = StyleSheet.create({
  topic: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    flexDirection: 'row'
  },
  posts: {
    width: '15%',
    textAlign: 'right',
    color: '#707070',
    fontWeight: '500'
  },
  name: {
    flex: 1,
    color: '#202020',
    fontWeight: '100',
    flexDirection: 'row',
    alignItems: 'center'
  },
  highlighted: {
    fontWeight: '600'
  }
});

const Topic = props => (
  <View style={styles.topic}>
    <Text style={styles.name}>
      {
        props.search ?
          highlight(props.topic, props.search) :
          props.topic
      }
    </Text>
    <Text style={styles.posts}>{props.posts}</Text>
  </View>
);

export default Topic;
