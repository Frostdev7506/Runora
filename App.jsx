import React, {useState, useEffect} from 'react';

import './components/gesture-handler';
import {NavigationContainer} from '@react-navigation/native';

import MyStack from './navigation/Stack';

const App = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;
