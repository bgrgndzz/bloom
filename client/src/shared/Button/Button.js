import React, {Component} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native'

export default class Button extends Component {
  render() {
    const buttonText = this.props.text || '';
    const width = this.props.width || Dimensions.get('window').width - 50;
    return (
      <TouchableOpacity>
        <View style={[styles.button, {width}]}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#16425B',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17
  }
});