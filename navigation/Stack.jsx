import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Initial from '../components/Initial';
import Home from '../components/Home';
import Questionnaire from '../components/Questionnaire';

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
      {/* Add more screens here */}
    </Stack.Navigator>
  );
}

export default MyStack;
