import React, {Component} from 'react';
import {
  StyleSheet, 
  View, 
  Image, 
  Dimensions, 
  Animated,
  Easing
} from 'react-native';

import Buttons from './Buttons/Buttons';
import Login from './Login/Login';
import Register from './Register/Register';

import logomark from '../images/logomark.png';

export default class Landing extends Component {
  state = {
    preset: 'Landing'
  }

  componentWillMount() {
    this.animatedState = {
      loginOpacity: new Animated.Value(0),
      registerOpacity: new Animated.Value(0),
      landingOpacity: new Animated.Value(1),
      logomarkOpacity: new Animated.Value(1),
      backgroundHeight: new Animated.Value(Dimensions.get('window').height * 0.75)
    };
    this.animationPresets = {
      'Login': () => {
        this.setState({preset: this.state.preset + '-Login'}, () => {
          Animated.timing(
            this.animatedState.backgroundHeight,
            {
              toValue: Dimensions.get('window').height * 0.35,
              duration: 250,
              easing: Easing.bezier(0.77, 0, 0.175, 1)
            }
          ).start();
          Animated.timing(
            this.animatedState.loginOpacity,
            {
              toValue: 1,
              duration: 75,
              delay: 75,
              easing: Easing.bezier(0.77, 0, 0.175, 1)
            }
          ).start();
          Animated.parallel([
            Animated.timing(
              this.animatedState.logomarkOpacity,
              {
                toValue: 0,
                duration: 125,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            ),
            Animated.timing(
              this.animatedState.registerOpacity,
              {
                toValue: 0,
                duration: 250,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            ),
            Animated.timing(
              this.animatedState.landingOpacity,
              {
                toValue: 0,
                duration: 250,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            )
          ]).start(() => {
            this.setState({preset: 'Login'});
          });
        });
      },
      'Register': () => {
        this.setState({preset: this.state.preset + 'Register'}, () => {
          Animated.timing(
            this.animatedState.backgroundHeight,
            {
              toValue: Dimensions.get('window').height * 0.25,
              duration: 250,
              easing: Easing.bezier(0.77, 0, 0.175, 1)
            }
          ).start();
          Animated.timing(
            this.animatedState.registerOpacity,
            {
              toValue: 1,
              duration: 75,
              delay: 75,
              easing: Easing.bezier(0.77, 0, 0.175, 1)
            }
          ).start();
          Animated.parallel([
            Animated.timing(
              this.animatedState.logomarkOpacity,
              {
                toValue: 0,
                duration: 125,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            ),
            Animated.timing(
              this.animatedState.loginOpacity,
              {
                toValue: 0,
                duration: 250,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            ),
            Animated.timing(
              this.animatedState.landingOpacity,
              {
                toValue: 0,
                duration: 250,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            )
          ]).start(() => {
            this.setState({preset: 'Register'});
          });
        });
      },
      'Landing': () => {
        this.setState({preset: 'Landing' + this.state.preset}, () => {
          Animated.timing(
            this.animatedState.backgroundHeight,
            {
              toValue: Dimensions.get('window').height * 0.75,
              duration: 250,
              easing: Easing.bezier(0.77, 0, 0.175, 1)
            }
          ).start();
          Animated.parallel([
            Animated.timing(
              this.animatedState.logomarkOpacity,
              {
                toValue: 1,
                delay: 125,
                duration: 125,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            ),
            Animated.timing(
              this.animatedState.loginOpacity,
              {
                toValue: 0,
                duration: 125,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            ),
            Animated.timing(
              this.animatedState.registerOpacity,
              {
                toValue: 0,
                duration: 125,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            ),
            Animated.timing(
              this.animatedState.landingOpacity,
              {
                toValue: 1,
                duration: 250,
                easing: Easing.bezier(0.77, 0, 0.175, 1)
              }
            )
          ]).start(() => {
            this.setState({preset: 'Landing'});
          });
        });
      }
    };
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.background,
            {height: this.animatedState.backgroundHeight}
          ]}
        >
          {this.state.preset.includes('Landing') && (
            <Animated.View 
              style={[
                styles.logoBox,
                {opacity: this.animatedState.logomarkOpacity}
              ]}                                                                                                                                                                              
            >
              <Animated.Image 
                style={styles.logomark}
                source={logomark}
                resizeMode="contain"
              />
            </Animated.View>
          )}
        </Animated.View>
        {this.state.preset.includes('Landing') && (
          <Animated.View 
            style={[
              styles.buttons,
              {opacity: this.animatedState.landingOpacity}
            ]}
          >
            <Buttons animationPresets={this.animationPresets} />
          </Animated.View>
        )}
        {this.state.preset.includes('Login') && (
          <View style={styles.main}>
            <Animated.View 
              style={[
                styles.login,
                {opacity: this.animatedState.loginOpacity}
              ]}
            >
              <Login animationPresets={this.animationPresets} />
            </Animated.View>
          </View>
        )}
        {this.state.preset.includes('Register') && (
          <View style={styles.main}>
            <Animated.View 
              style={[
                styles.register,
                {opacity: this.animatedState.registerOpacity}
              ]}
            >
              <Register animationPresets={this.animationPresets} />
            </Animated.View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    backgroundColor: '#16425B',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    flex: 1
  },
  main: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  login: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.25, 
    shadowRadius: 10, 
    elevation: 5
  },
  register: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.25, 
    shadowRadius: 10, 
    elevation: 5
  },
  logomark: {
    width: Dimensions.get('window').width * 0.75
  }
});
