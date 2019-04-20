import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

export default class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.button, this.props.style]}
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        {
          this.props.disabled ?
          <ActivityIndicator /> :
          <Text style={styles.buttonText}>{this.props.text || ''}</Text>
        }
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#16425B',
    padding: 10,
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
