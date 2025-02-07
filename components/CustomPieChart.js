// CustomPieChart.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';

const CustomPieChart = ({ budget, expenses, symbol = '$', chartSize = 200 }) => {
  const theme = useTheme();
  const expenseAngle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const total = budget;
    let expenseRatio = 0;

    if (total > 0) {
      expenseRatio = Math.min(1, expenses / total);
    }

    const finalExpenseAngle = expenseRatio * 360;

    Animated.timing(expenseAngle, {
      toValue: finalExpenseAngle,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [budget, expenses, expenseAngle]);

  const expenseRotation = expenseAngle.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  // Calculate remaining amount and percentage
  const remainingAmount = budget - expenses;
  const remainingPercentage = budget === 0 ? 0 : Math.round((remainingAmount / budget) * 100);

  const innerSize = chartSize * 0.9; // Size of the actual pie chart

  return (
    <Surface style={[styles.chartContainer, { width: chartSize, height: chartSize }]} elevation={2}>
      <View style={[styles.innerContainer, { width: innerSize, height: innerSize }]}>
        {/* Base circle (light purple) */}
         <View style={[styles.baseCircle, { backgroundColor: '#e0f7fa'}]} />

        {/* Animated expense slice */}
          <Animated.View
            style={[
            styles.slice,
            {
                backgroundColor: '#B00020',
                transform: [
                { rotate: '0deg' },
                { translateX: innerSize / 2 },
                { rotate: expenseRotation },
                { translateX: -innerSize / 2 },
                ],
            },
            ]}
        />

        {/* Border */}
        <View
          style={[
            styles.border,
            {
              borderColor:  '#008080',
            }
          ]}
        />

        {/* Center white circle for text */}
       <View style={[styles.centerCircle, { backgroundColor: '#ffffff' }]}>
            <Text
                variant="titleLarge"
                style={[styles.amountText, { color: '#008080' }]}
            >
                {symbol}{remainingAmount.toLocaleString()}
            </Text>
            <Text
                variant="labelMedium"
                style={[styles.percentageText, { color: '#008080' }]}
            >
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
    padding: 10, // Add padding to contain shadows
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
  slice: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
    transformOrigin: 'right',
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