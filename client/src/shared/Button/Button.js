import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  TouchableOpacity
} from 'react-native';

export default class Button extends Component {
  state = {disabled: false}

  onPress = () => {
    this.setState({disabled: true}, () => {
      this.disabledTimer = setTimeout(() => this.setState({disabled: false}), 1000);
      this.props.onPress();
    });
  }

  componentWillUnmount = () => {
    if (this.disabledTimer) clearTimeout(this.disabledTimer);
  }

  render() {
    const buttonText = this.props.text || '';
    return (
      <TouchableOpacity 
        style={[styles.button, this.props.style]}
        onPress={this.onPress}
        disabled={this.state.disabled}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
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