import React, {useEffect, useRef} from 'react';
import {Animated, Text, StyleSheet, Easing} from 'react-native';

const AnimatedTitle = ({children}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Complex animation sequence (modified to run only once)
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Optional: Reset values after animation completes
      // This is useful if you want to trigger the animation again later
      animatedValue.setValue(0);
      scaleValue.setValue(0);
    });

    // No need for a cleanup function now that the animation runs only once
    // return () => {
    //   animatedValue.setValue(0);
    //   scaleValue.setValue(0);
    // };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Interpolate animated values (no changes needed here)
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const rotateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  const scale = scaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.7, 1],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#008080', '#00a0a0', '#008080'],
  });

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Animated.Text
        style={[
          styles.title,
          {
            transform: [{translateY}, {rotateX}, {scale}],
            opacity,
            backgroundColor,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          },
        ]}>
        {children}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1.5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default AnimatedTitle;