import React, {useRef, useEffect} from 'react';
import {TouchableOpacity, Animated, Easing, StyleSheet} from 'react-native';

const AnimatedTouchable = ({onPress, children, style}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous pulsing animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseValue]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Interpolate the pulse value for subtle background color and shadow changes
  const backgroundColor = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#008080', '#00a0a0'],
  });

  const shadowOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.4],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{scale: scaleValue}],
          backgroundColor,
          shadowOpacity,
        },
        style,
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.button}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    shadowColor: '#008080',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 5,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedTouchable;
