import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '105%',
    marginLeft: '-2.5%'
  },
  inactive: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    margin: '2.5%'
  },
  active: {
    flex: 1,
    backgroundColor: '#16425B',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    margin: '2.5%'
  },
  inactiveText: {
    color: 'rgba(0, 0, 0, 0.75)',
    textAlign: 'center',
    fontSize: 15
  },
  activeText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15
  }
});

const DoubleSelect = props => (
  <View style={styles.container}>
    {Object.keys(props.options).map(option => (
      <TouchableOpacity
        style={props.option === option ? styles.active : styles.inactive}
        onPress={() => props.onChangeOption(option)}
        key={option}
      >
        <Text style={styles[`${props.option === option ? 'active' : 'inactive'}Text`]}>{props.options[option]}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default DoubleSelect;
