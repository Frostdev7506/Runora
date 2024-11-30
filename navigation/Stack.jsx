import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Initial from '../components/Initial';
import Home from '../components/Home';
import Questionnaire from '../components/Questionnaire';
import Stats from '../components/Stats';
import SettingsScreen from '../components/SettingScreen';

const Stack = createStackNavigator();

const screens = [
  {name: 'Initial', component: Initial},
  {
    name: 'Questionnaire',
    component: Questionnaire,
  },
  {name: 'Home', component: Home},
  {name: 'Stats', component: Stats},
  {name: 'Settings', component: SettingsScreen},
];

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Initial"
      screenOptions={{headerShown: false}}>
      {screens.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </Stack.Navigator>
  );
}

export default MyStack;
