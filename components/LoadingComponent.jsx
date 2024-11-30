// LoadingComponent.js
import React from 'react';
import {View, ActivityIndicator} from 'react-native';

const LoadingComponent = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" color="#008080" />
  </View>
);

export default LoadingComponent;
