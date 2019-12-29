import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import { CachedImage } from 'react-native-cached-image';
import Permissions from 'react-native-permissions';

import Input from '../../shared/Input/Input';
import Button from '../../shared/Button/Button';
import FontAwesome from '../../shared/FontAwesome/FontAwesome';
import Badge from '../shared/Badge/Badge';

import api from '../../shared/api';

import badgeList from './badgeList';

import defaultProfile from '../../images/defaultprofile.png';

export default class EditProfile extends Component {
  state = {
    about: '',
    profilepicture: {
      type: 'default'
    },
    badge: '',
    availableBadges: [],
    detailedBadge: '',
    cameraPermission: 'undetermined',
    photoPermission: 'undetermined',
    modalOpen: false,
    badgeModalOpen: false
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
          badge: res.user.mainBadge,
          detailedBadge: res.user.mainBadge,
          availableBadges: res.user.badges,
          profilepicture: (res.user.profilepicture ? {
            type: 'uri',
            uri: res.user.profilepicture
          } : { type: 'default' }),
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
    const { badge, about, profilepicture } = this.state;
    api(
      {
        path: 'user/edit/',
        method: 'POST',
        body: {
          profilepicture: profilepicture.type === 'base64' ? profilepicture : null,
          about,
          badge
        },
        jwt
      },
      (err, res) => {
        if (err && !res) {
          if (err === 'unauthenticated') return this.props.logout();
          return Alert.alert(err);
        }

        return this.props.navigation.push('Profile', { jwt });
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
            <TouchableOpacity
              onPress={() => this.setState({ badgeModalOpen: true })}
              style={styles.badgeButtonContainer}
            >
              <Text style={styles.badgeButtonLabel}>Bloop: </Text>
              {this.state.badge ? (
                <Badge
                  badge={this.state.badge}
                  size="small"
                />
              ) : <Text>Seçilmedi</Text>}
            </TouchableOpacity>
            <Input
              placeholder="Hakkında"
              onChangeText={this.onChangeText('about')}
              multiline={true}
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
          style={styles.badgeModalContainer}
          visible={this.state.badgeModalOpen}
          transparent
        >
          <TouchableOpacity
            style={styles.badgeModalBackdrop}
            onPress={() => this.setState({ badgeModalOpen: false })}
          />
          <ScrollView style={styles.badgeModal} contentContainerStyle={styles.badgeModalContent}>
            {badgeList.map(badge => {
              let style = '';
              if (this.state.badge === badge.name) {
                style = 'Selected';
              } else if (!this.state.availableBadges.includes(badge.name)) {
                style = 'Unavailable';
              }

              return (
                <TouchableOpacity
                  style={styles[`badgeModalBadge${style}`]}
                  key={badge.name}
                  onPress={() => {
                    const newState = {
                      detailedBadge: badge.name
                    };
                    if (this.state.availableBadges.includes(badge.name)) newState.badge = badge.name;
                    return this.setState(newState);
                  }}
                >
                  <Badge
                    badge={badge.name}
                    size="small"
                  />
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={this.state.badge === '' ? styles.badgeModalBadgeSelected : styles.badgeModalBadge}
              onPress={() => this.setState({
                detailedBadge: '',
                badge: ''
              })}
            >
              <Text>Hiçbiri</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
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

  },
  badgeButtonContainer: {
    width: '50%',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  badgeModal: {
    width: 300,
    height: 400,
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 200,
    left: Dimensions.get('window').width / 2 - 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 10
  },
  badgeModalContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  badgeModalBadge: {
    width: 120,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 10,
  },
  badgeModalBadgeUnavailable: {
    width: 120,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    borderRadius: 10,
  },
  badgeModalBadgeSelected: {
    width: 120,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#16425B',
    borderWidth: 2
  },
  badgeModalBadgeNone: {
    width: 120,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 10
  },
  badgeModalBackdrop: {
    flex: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
/* TODO:
- show badge details in modal
*/
