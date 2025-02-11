import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';

const CustomPieChart = ({ budget, expenses, symbol = '$', chartSize = 200 }) => {
  const theme = useTheme();
  const expenseAngle = useRef(new Animated.Value(0)).current;
  const rightExpenseAngle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const total = budget;
    let expenseRatio = 0;

    if (total > 0) {
      expenseRatio = Math.min(1, expenses / total);
    }

    const finalExpenseAngle = expenseRatio * 360;
    
    // Reset both animations
    expenseAngle.setValue(0);
    rightExpenseAngle.setValue(0);

    // Animate left half (0 to 180 degrees)
    Animated.timing(expenseAngle, {
      toValue: Math.min(180, finalExpenseAngle),
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Animate right half (180 to 360 degrees)
    if (finalExpenseAngle > 180) {
      Animated.timing(rightExpenseAngle, {
        toValue: Math.min(180, finalExpenseAngle - 180),
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [budget, expenses, expenseAngle, rightExpenseAngle]);

  const leftRotation = expenseAngle.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const rightRotation = rightExpenseAngle.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const remainingAmount = budget - expenses;
  const remainingPercentage = budget === 0 ? 0 : Math.round((remainingAmount / budget) * 100);
  const innerSize = chartSize * 0.9;

  return (
    <Surface style={[styles.chartContainer, { width: chartSize, height: chartSize }]} elevation={2}>
      <View style={[styles.innerContainer, { width: innerSize, height: innerSize }]}>
        {/* Base circle (light purple) */}
        <View style={[styles.baseCircle, { backgroundColor: '#e0f7fa' }]} />

        {/* Left half container */}
        <View style={styles.leftHalf}>
          <Animated.View
            style={[
              styles.slice,
              {
                backgroundColor: '#B00020',
                transform: [{ rotate: leftRotation }],
              },
            ]}
          />
        </View>

        {/* Right half container */}
        <View style={styles.rightHalf}>
          <Animated.View
            style={[
              styles.slice,
              {
                backgroundColor: '#B00020',
                transform: [{ rotate: rightRotation }],
              },
            ]}
          />
        </View>

        {/* Border */}
        <View style={[styles.border, { borderColor: '#008080' }]} />

        {/* Center white circle for text */}
        <View style={[styles.centerCircle, { backgroundColor: '#ffffff' }]}>
          <Text variant="titleLarge" style={[styles.amountText, { color: '#008080' }]}>
            {symbol}
            {remainingAmount.toLocaleString()}
          </Text>
          <Text variant="labelMedium" style={[styles.percentageText, { color: '#008080' }]}>
            Remaining ({remainingPercentage}%)
          </Text>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  innerContainer: {
    position: 'relative',
    borderRadius: 1000,
    overflow: 'hidden',
  },
  baseCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  leftHalf: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    left: 0,
    overflow: 'hidden',
  },
  rightHalf: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    right: 0,
    overflow: 'hidden',
  },
  slice: {
    position: 'absolute',
    width: '200%',
    height: '100%',
    transformOrigin: 'right',
    left: 0,
  },
  centerCircle: {
    position: 'absolute',
    width: '75%',
    height: '75%',
    borderRadius: 1000,
    top: '12.5%',
    left: '12.5%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  border: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 2,
  },
  amountText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
  percentageText: {
    textAlign: 'center',
    marginTop: 4,
  },
});

export default CustomPieChart;