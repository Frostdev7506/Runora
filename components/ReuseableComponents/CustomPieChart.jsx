import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { Text, useTheme, Surface, Portal, Modal, Button } from 'react-native-paper';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const CustomPieChart = ({ 
  budget = 0, 
  expenses = 0, 
  symbol = '$', 
  chartSize = 200,
  onPress
}) => {
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  const expenseAngle = useRef(new Animated.Value(0)).current;
  const rightExpenseAngle = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const remainingAmount = Math.max(0, budget - expenses);
  const remainingPercentage = budget === 0 ? 0 : Math.round((remainingAmount / budget) * 100);
  const expensePercentage = budget === 0 ? 0 : Math.round((expenses / budget) * 100);
  const innerSize = chartSize * 0.9;

  useEffect(() => {
    animateChart();
  }, [budget, expenses]);

  const animateChart = () => {
    // Calculate the expense ratio (not the remaining ratio)
    const expenseRatio = budget > 0 ? Math.min(1, expenses / budget) : 0;
    // Convert to degrees, starting from the top (270 degrees)
    const startAngle = -90; // Start from top
    const finalExpenseAngle = expenseRatio * 360;

    expenseAngle.setValue(0);
    rightExpenseAngle.setValue(0);

    Animated.parallel([
      Animated.timing(expenseAngle, {
        toValue: Math.min(180, finalExpenseAngle),
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }),
      finalExpenseAngle > 180 
        ? Animated.timing(rightExpenseAngle, {
            toValue: Math.min(180, finalExpenseAngle - 180),
            duration: 1000,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: false,
          })
        : null,
    ].filter(Boolean)).start();
  };

  const leftRotation = expenseAngle.interpolate({
    inputRange: [0, 180],
    outputRange: ['-90deg', '90deg'], // Start from top (-90 degrees)
  });

  const rightRotation = rightExpenseAngle.interpolate({
    inputRange: [0, 180],
    outputRange: ['-90deg', '90deg'], // Start from top (-90 degrees)
  });

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowDetails(true);
    if (onPress) onPress();
  };

  return (
    <GestureHandlerRootView>
      <TapGestureHandler onActivated={handlePress}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Surface style={[styles.chartContainer, { width: chartSize, height: chartSize }]} elevation={3}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.gradient}
            />
            <View style={[styles.innerContainer, { width: innerSize, height: innerSize }]}>
              {/* Base circle is now red (expenses) */}
              <View style={[styles.baseCircle, { backgroundColor: '#FF0000' }]} />

              {/* The animated parts now show the remaining balance in green */}
              <View style={styles.leftHalf}>
                <Animated.View
                  style={[
                    styles.slice,
                    {
                      backgroundColor: '#4CAF50', // Green for remaining
                      transform: [{ rotate: leftRotation }],
                    },
                  ]}
                />
              </View>

              <View style={styles.rightHalf}>
                <Animated.View
                  style={[
                    styles.slice,
                    {
                      backgroundColor: '#4CAF50', // Green for remaining
                      transform: [{ rotate: rightRotation }],
                    },
                  ]}
                />
              </View>

              <View style={[styles.centerCircle, { backgroundColor: theme.colors.background }]}>
                <Text variant="headlineMedium" style={styles.amountText}>
                  {symbol}{remainingAmount.toLocaleString()}
                </Text>
                <Text variant="labelMedium" style={styles.percentageText}>
                  {remainingPercentage}% Left
                </Text>
              </View>
            </View>
          </Surface>
        </Animated.View>
      </TapGestureHandler>

      <Portal>
        <Modal
          visible={showDetails}
          onDismiss={() => setShowDetails(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Budget Details</Text>
          <View style={styles.detailRow}>
            <Text variant="bodyLarge">Total Budget:</Text>
            <Text variant="bodyLarge" style={styles.detailValue}>
              {symbol}{budget.toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text variant="bodyLarge">Expenses:</Text>
            <Text variant="bodyLarge" style={[styles.detailValue, { color: '#FF0000' }]}>
              {symbol}{expenses.toLocaleString()} ({expensePercentage}%)
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text variant="bodyLarge">Remaining:</Text>
            <Text variant="bodyLarge" style={[styles.detailValue, { color: '#4CAF50' }]}>
              {symbol}{remainingAmount.toLocaleString()} ({remainingPercentage}%)
            </Text>
          </View>
          <Button 
            mode="contained" 
            onPress={() => setShowDetails(false)} 
            style={[styles.closeButton, { backgroundColor: '#FF0000' }]}
          >
            Close
          </Button>
        </Modal>
      </Portal>
    </GestureHandlerRootView>
  );
};


const styles = StyleSheet.create({
  chartContainer: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    width: '80%',
    height: '80%',
    borderRadius: 1000,
    top: '10%',
    left: '10%',
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
  amountText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  percentageText: {
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  detailValue: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'red',
    marginTop: 20,
  },
});

export default CustomPieChart;