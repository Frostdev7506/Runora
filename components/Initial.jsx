import React, {useState, useEffect} from 'react';
import {View, Text, Animated, StyleSheet, Alert} from 'react-native';

const Initial = () => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Alert.alert('Hello', 'Welcome to Runora');

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: 2000, // Duration for fade-in
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(fadeAnim, {
          toValue: 0, // Animate to opacity: 0 (transparent)
          duration: 2000, // Duration for fade-out
          useNativeDriver: true, // Use native driver for better performance
        }),
      ]),
      {iterations: -1}, // Infinite loop
    );

    animation.start();

    // Cleanup the animation on unmount
    return () => {
      animation.stop();
    };
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{...styles.fadeInView, opacity: fadeAnim}}>
        <Text style={styles.text}>Runora</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  fadeInView: {
    width: 250,
    height: 50,
    backgroundColor: 'powderblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Add some rounded corners for better appearance
  },
  text: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
  },
});

export default Initial;
