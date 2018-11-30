import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity
} from 'react-native';

export default class DoubleSelect extends Component {
  render() {

    return (
      <View style={styles.container}>
        {Object.keys(this.props.options).map(option => (
          <TouchableOpacity 
            style={this.props.option === option ? styles.active : styles.inactive}
            onPress={() => this.props.onChangeOption(option)}
            key={option}
          >
            <Text style={this.props.option === option ? styles.activeText : styles.inactiveText}>{this.props.options[option]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inactive: {
    width: '45%',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1,
  },
  active: {
    width: '45%',
    backgroundColor: '#16425B',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1,
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
