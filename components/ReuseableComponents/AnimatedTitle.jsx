import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AnimatedTitle = ({ children }) => {
  const titleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[styles.container, {
        opacity: titleAnimation,
        transform: [{
          translateY: titleAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-20, 0]
          })
        }]
      }]}
    >
      <Icon name="home" size={36} color="#008080" style={styles.icon} />
      <Text style={styles.text}>{children}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#008080',
    marginLeft: 8,
  },
  icon: {
     height: 36,
    width: 36,
    marginRight: 8,
  },
});

export default AnimatedTitle;