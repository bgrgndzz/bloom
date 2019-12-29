import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput
} from 'react-native';

export default class Input extends Component {
  render() {
    const width = this.props.width || '100%';
    let props = {
      clearButtonMode: this.props.clearButtonMode,
      placeholder: this.props.placeholder,
      multiline: this.props.multiline,
      onChangeText: this.props.onChangeText,
      value: this.props.value,
      underlineColorAndroid: 'transparent',
      style: [styles.input, this.props.style]
    };

    if (this.props.type) {
      if (this.props.type === 'email') {
        props.keyboardType = 'email-address';
        props.autoCorrect = false;
        props.textContentType = 'emailAddress';
        props.autoCapitalize = 'none';
      } else if (this.props.type === 'password') {
        props.secureTextEntry = true;
        props.autoCorrect = false;
        props.textContentType = 'password';
      }
    }

    return (
      <View style={[styles.inputContainer, {width}, this.props.containerStyle]}>
        <TextInput {...props} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    marginBottom: 25
  },
  input: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  }
});
