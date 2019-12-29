import React, { PureComponent } from 'react';
import {
  AsyncStorage,
  AppState,
  PushNotificationIOS
} from 'react-native';

import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
import codePush from 'react-native-code-push';
import io from 'socket.io-client';
import PushNotification from 'react-native-push-notification';

import AuthLoading from './AuthLoading/AuthLoading';
import Landing from './Landing/Landing';
import Page from './Main/shared/hoc/Page/Page';

import Feed from './Main/Feed/Feed';
import Topics from './Main/Topics/Topics';
import Topic from './Main/Topic/Topic';
import Profile from './Main/Profile/Profile';
import Notifications from './Main/Notifications/Notifications';
import CreateTopic from './Main/CreateTopic/CreateTopic';
import Settings from './Main/Settings/Settings';
import EditProfile from './Main/EditProfile/EditProfile';
import Messages from './Main/Messages/Messages';
import Conversation from './Main/Conversation/Conversation';
import Likes from './Main/Likes/Likes';
import Followers from './Main/Followers/Followers';
import School from './Main/School/School';
import Comments from './Main/Comments/Comments';

const LandingStack = createStackNavigator({ Landing }, { headerMode: 'none' });
const MainStack = createStackNavigator(
  {
    Feed: Page(Feed),
    Topics: Page(Topics),
    Topic: Page(Topic),
    Profile: Page(Profile),
    CreateTopic: Page(CreateTopic),
    Settings: Page(Settings),
    EditProfile: Page(EditProfile),
    Notifications: Page(Notifications),
    Messages: Page(Messages),
    Conversation: Page(Conversation),
    Likes: Page(Likes),
    Followers: Page(Followers),
    School: Page(School),
    Comments: Page(Comments)
  },
  {
    initialRouteName: 'Topics',
    headerMode: 'none'
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    { AuthLoading, MainStack, LandingStack },
    {
      initialRouteName: 'AuthLoading',
      headerMode: 'none'
    }
  )
);

class App extends PureComponent {
  state = {
    jwt: '',
    notificationToken: '',
    socket: {},
    appState: AppState.currentState
  };

  socket = {};

  setJWT = jwt => {
    this.setState({ jwt });
  }

  socketConnect = callback => {
    this.setState({
      socket: io('https://www.getbloom.info/socket.io/', {
        query: {
          token: this.state.jwt
        },
        forceNew: true,
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: Infinity,
        transports: ['websocket']
      })
    }, callback);
  }

  socketDisconnect = callback => {
    this.state.socket.disconnect();
    this.setState({ socket: {} }, callback);
  }

  handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.socketConnect();
    } else if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.socketDisconnect();
    }
    this.setState({ appState: nextAppState });
  }

  componentWillMount() {
    AsyncStorage
      .getItem('jwt')
      .then(jwt => {
        if (jwt) this.setState({ jwt });

        AsyncStorage
          .getItem('notificationToken')
          .then(notificationToken => {
            if (notificationToken) this.setState({ notificationToken });
            PushNotification.configure({
              onRegister: token => {
                if (!notificationToken) {
                  AsyncStorage.setItem('notificationToken', token.token);
                  this.setState({ notificationToken: token.token });
                }
              },
              onNotification: notification => {
                notification.finish(PushNotificationIOS.FetchResult.NoData);
              },
              permissions: {
                alert: true,
                badge: true,
                sound: true
              },
              senderID: '73006798043',
              popInitialNotification: true,
              requestPermissions: true
            });
          });
      });
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.socketDisconnect();
  }

  render() {
    return this.state.notificationToken ? (
      <AppContainer
        ref={nav => { this.navigator = nav; }}
        screenProps={{
          socket: this.state.socket,
          jwt: this.state.jwt,
          notificationToken: this.state.notificationToken,
          setJWT: this.setJWT,
          socketConnect: this.socketConnect,
          socketDisconnect: this.socketDisconnect
        }}
      />
    ) : null;
  }
}

export default codePush(App);
