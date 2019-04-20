import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import { CachedImage } from 'react-native-cached-image';
import Permissions from 'react-native-permissions';

import Input from '../../shared/Input/Input';
import Button from '../../shared/Button/Button';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';

import api from '../../shared/api';

import defaultProfile from '../../images/defaultprofile.png';

export default class EditProfile extends Component {
  state = {
    about: '',
    profilepicture: {
      type: 'default'
    },
    cameraPermission: 'undetermined',
    photoPermission: 'undetermined',
    modalOpen: false
  }

  requestPermission = (item, callback) => {
    Permissions.request(item).then(response => {
      this.setState({ [`${item}Permission`]: response }, callback);
    });
  }

  checkCameraAndPhotoPermissions = () => {
    Permissions.checkMultiple(['camera', 'photo']).then(response => {
      this.setState({
        cameraPermission: response.camera,
        photoPermission: response.photo,
      });
    });
  }

  getUser = () => {
    const { jwt } = this.props.screenProps;
    api(
      {
        path: 'user/1',
        method: 'GET',
        jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        return this.setState({
          about: res.user.about || '',
          profilepicture: res.user.profilepicture ? {
            type: 'uri',
            uri: res.user.profilepicture
          } : { type: 'default' }
        });
      }
    );
  }

  openImagePicker = (type) => {
    const options = {
      width: 300,
      height: 300,
      compressImageMaxWidth: 512,
      compressImageMaxHeight: 512,
      includeBase64: true,
      avoidEmptySpaceAroundImage: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
      cropperChooseText: 'Seç',
      cropperCancelText: 'Vazgeç',
      loadingLabelText: 'Yükleniyor...',
      cropping: true
    };

    (callback => {
      let imagePicker;
      if (type === 'camera') {
        if (this.state.cameraPermission === 'authorized') {
          imagePicker = ImagePicker.openCamera;
          return callback(imagePicker);
        }
        if (this.state.cameraPermission === 'undetermined') {
          return this.requestPermission('camera', () => {
            imagePicker = ImagePicker.openCamera;
            callback(imagePicker);
          });
        }
        return Alert.alert('Lütfen ayarlardan kamera izinlerini ayarlayın.');
      }
      if (type === 'picker') {
        if (this.state.photoPermission === 'authorized') {
          imagePicker = ImagePicker.openPicker;
          return callback(imagePicker);
        }
        if (this.state.photoPermission === 'undetermined') {
          return this.requestPermission('photo', () => {
            imagePicker = ImagePicker.openPicker;
            callback(imagePicker);
          });
        }
        return Alert.alert('Lütfen ayarlardan fotoğraf izinlerini ayarlayın.');
      }

      return Alert.alert('Bilinmeyen bir hata oluştu.');
    })(imagePicker => {
      if (
        (type === 'camera' && this.state.cameraPermission) ||
        (type === 'picker' && this.state.photoPermission)
      ) {
        imagePicker(options)
          .then(image => {
            this.setState({
              profilepicture: {
                type: 'base64',
                mime: image.mime,
                data: image.data,
                uri: `data:${image.mime};base64,${image.data}`
              },
              modalOpen: false
            });
          })
          .catch(err => {
            if (err && err.code !== 'E_PICKER_CANCELLED') Alert.alert('Bilinmeyen bir hata oluştu.');
            this.setState({ modalOpen: false });
          });
      }
    });
  }

  submitProfileInfo = () => {
    const { jwt } = this.props.screenProps;
    const { about, profilepicture } = this.state;
    api(
      {
        path: 'user/edit/',
        method: 'POST',
        body: {
          profilepicture: profilepicture.type === 'base64' ? profilepicture : null,
          about,
        },
        jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        return this.props.navigation.navigate('Profile', { jwt });
      }
    );
  }

  onChangeText = key => input => this.setState({ [key]: input });

  componentWillMount = this.getUser;

  componentDidMount = this.checkCameraAndPhotoPermissions;

  render() {
    let profilepicture;
    switch (this.state.profilepicture.type) {
      case 'uri':
        profilepicture = { uri: `https://www.getbloom.info/uploads/profilepictures/${this.state.profilepicture.uri}` };
        break;
      case 'base64':
        profilepicture = { uri: this.state.profilepicture.uri };
        break;
      case 'default':
      default:
        profilepicture = defaultProfile;
        break;
    }

    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Profilini Düzenle</Text>
          <View style={styles.form}>
            <CachedImage
              style={styles.profilepicture}
              source={profilepicture}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => this.setState({ modalOpen: true })}
            >
              <Text style={styles.profilepictureText}>
                <FontAwesome icon="pen" />
                Profil fotoğrafını değiştir
              </Text>
            </TouchableOpacity>
            <Input
              placeholder="Hakkında"
              onChangeText={this.onChangeText('about')}
              value={this.state.about}
              containerStyle={styles.input}
            />
            <Button
              text="Kaydet"
              onPress={this.submitProfileInfo}
            />
          </View>
        </View>
        <Modal
          style={styles.imageModalContainer}
          visible={this.state.modalOpen}
          transparent
        >
          <TouchableOpacity
            style={styles.imageModalBackdrop}
            onPress={() => this.setState({ modalOpen: false })}
          />
          <View style={styles.imageModalContent}>
            <TouchableOpacity
              style={styles.imageModalItem}
              onPress={() => this.openImagePicker('camera')}
            >
              <Text style={styles.imageModalText}>Fotoğraf Çek</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageModalItem}
              onPress={() => this.openImagePicker('picker')}
            >
              <Text style={styles.imageModalText}>Kütüphaneden Seç</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageModalCancel}
              onPress={() => this.setState({ modalOpen: false })}
            >
              <Text style={styles.imageModalCancelText}>Vazgeç</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 0
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },
  formHeading: {
    fontSize: 25,
    fontWeight: '900',
    color: '#16425B',
    marginBottom: 15,
    textAlign: 'center'
  },
  input: { marginBottom: 15 },
  profilepicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  profilepictureText: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#16425B',
    fontWeight: '500'
  },
  imageModalBackdrop: {
    flex: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageModalContent: {
    flex: 2,
    backgroundColor: 'white'
  },
  imageModalItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)'
  },
  imageModalText: {
    textAlign: 'center',
    fontSize: 15
  },
  imageModalCancel: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageModalCancelText: {
    color: '#EA3546',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center'
  }
});
