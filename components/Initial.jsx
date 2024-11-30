import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import useStore from '../store/store.js';

const Initial = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const loopCount = useRef(0);
  const navigation = useNavigation();
  const {loadFromStorage, currency, region, carryOverBudget} = useStore();

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const isFirstTime = await AsyncStorage.getItem('@isFirstTime');
        if (isFirstTime) {
          // Load data from storage
          await loadFromStorage();
          // Navigate to Home screen
          navigation.replace('Home');
        } else {
          // Mark the app as  first time
          await AsyncStorage.setItem('@isFirstTime', 'true');
        }
      } catch (error) {
        console.error('Failed to check first time', error);
      }
    };

    checkFirstTime();

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
      {
        iterations: -1, // Infinite loop
        resetBeforeIteration: true, // Reset the animation before each iteration
      },
    );

    const animationListener = fadeAnim.addListener(({value}) => {
      if (value === 0) {
        loopCount.current += 1;
        if (loopCount.current >= 3) {
          // Stop the animation after 3 loops and navigate to Questionnaire
          animation.stop();
          fadeAnim.removeListener(animationListener);
          navigation.replace('Questionnaire');
        }
      }
    });

    animation.start();

    // Cleanup the animation on unmount
    return () => {
      animation.stop();
      fadeAnim.removeListener(animationListener);
    };
  }, [fadeAnim, navigation, loadFromStorage]);

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
    borderRadius: 10,
  },
  text: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
  },
});

export default Initial;
