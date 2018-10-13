import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  TouchableOpacity
} from 'react-native';

export default class Button extends Component {
  render() {
    const buttonText = this.props.text || '';
    return (
      <TouchableOpacity 
        style={styles.button}
        onPress={this.props.onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#16425B',
    padding: 12.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17
  }
});