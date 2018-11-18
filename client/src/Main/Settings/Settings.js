import React, {Component} from 'react';
import {
  StyleSheet, 
  ScrollView,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';

export default class Settings extends Component {
  componentWillMount = () => {
    this.settings = [
      {
        title: 'Profilini Düzenle',
        onPress: () => this.props.changePage('EditProfile')
      },
      {
        title: 'Gizlilik Sözleşmesi',
        onPress: () => Linking.openURL('http://192.168.1.34:3000/web/privacy-policy')
      },
      {
        title: 'Çıkış Yap',
        onPress: this.props.goHome
      }
    ];
  }

  render() {
    return (
      <ScrollView 
        style={styles.settings}
        showsVerticalScrollIndicator={false}
      >
        {this.settings.map((setting, index) => (
          <TouchableOpacity 
            style={styles.setting}
            key={index}
            onPress={setting.onPress}
          >
            <Text style={styles.settingTitle}>{setting.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  settings: {
    padding: 15
  },
  setting: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1,
    flexDirection: 'row'
  },
  settingTitle: {
    flex: 1,
    color: '#202020',
    fontWeight: '100'
  }
});