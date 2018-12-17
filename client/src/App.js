import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
import codePush from 'react-native-code-push';

import AuthLoading from './AuthLoading/AuthLoading';
import Landing from './Landing/Landing';
import Page from './Main/shared/hoc/Page/Page';

import Feed from './Main/Feed/Feed.js';
import Topics from './Main/Topics/Topics.js';
import Topic from './Main/Topic/Topic.js';
import Profile from './Main/Profile/Profile.js';
import Notifications from './Main/Notifications/Notifications.js';
import CreateTopic from './Main/CreateTopic/CreateTopic.js';
import Settings from './Main/Settings/Settings.js';
import EditProfile from './Main/EditProfile/EditProfile.js';

const LandingStack = createStackNavigator({Landing}, {headerMode: 'none'});
const MainStack = createStackNavigator(
  {
    Feed: Page(Feed),
    Topics: Page(Topics),
    Topic: Page(Topic),
    Profile: Page(Profile),
    CreateTopic: Page(CreateTopic),
    Settings: Page(Settings),
    EditProfile: Page(EditProfile),
    Notifications: Page(Notifications)
  }, 
  {
    initialRouteName: 'Feed',
    headerMode: 'none'
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      MainStack: MainStack,
      LandingStack: LandingStack,
    },
    {
      initialRouteName: 'AuthLoading',
      headerMode: 'none'
    }
  )
);

export default codePush(AppContainer);