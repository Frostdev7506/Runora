import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CurrentRouteName = ({ routeName }) => {
    return __DEV__ ? (
      <View style={styles.routeNameContainer}>
        <Text style={styles.routeNameText}>{routeName}</Text>
      </View>
    ) : null;
  };
  
const styles = StyleSheet.create({
  routeNameContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    alignItems: 'center',
    position: 'absolute',
    top: 0, // Changed from bottom: 0
    left: 0,
    width: '100%',
    zIndex: 100,
  },
  routeNameText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CurrentRouteName;