import React, {useState, useEffect} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';

const App = () => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Animate to opacity: 1 (opaque)
      duration: 2000, // Make it take a while
      useNativeDriver: true, // Use native driver for better performance
    }).start();
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
  },
  text: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
