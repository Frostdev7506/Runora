import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Initial from '../components/Initial';
import Home from '../components/Home';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Initial"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Initial" component={Initial} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}

export default MyStack;
