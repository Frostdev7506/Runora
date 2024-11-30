// LoadingComponent.js
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const LoadingComponent = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#008080" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingComponent;
