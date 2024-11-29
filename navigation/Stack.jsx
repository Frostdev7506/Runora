import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Initial from '../components/Initial';
import Home from '../components/Home';
import Questionnaire from '../components/Questionnaire';
import Stats from '../components/Stats';
import SettingsScreen from '../components/SettingScreen';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Initial"
      screenOptions={{headerShown: false}} // Hide header for all screens
    >
      <Stack.Screen name="Initial" component={Initial} />
      <Stack.Screen name="Questionnaire" component={Questionnaire} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Stats" component={Stats} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default MyStack;
