import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const ExpenseCard = ({expense}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.timing(pressOpacityAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(pressOpacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{scale: scaleAnim}],
          opacity: opacityAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, pressOpacityAnim._value],
          }),
        },
      ]}>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <LinearGradient colors={['#008080', '#00B4A2']} style={styles.gradient}>
          <View style={styles.expenseRow}>
            <Icon name="calendar" size={18} color="#ffffff" />
            <Text style={styles.cardText}>{expense.date}</Text>
          </View>
          <View style={styles.expenseRow}>
            <Icon name="tag" size={18} color="#ffffff" />
            <Text style={styles.cardText}>{expense.name}</Text>
          </View>
          <View style={styles.expenseRow}>
            <Icon name="dollar" size={18} color="#ffffff" />
            <Text style={styles.cardText}>{expense.amount}</Text>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',

    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  cardText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
    flex: 1,
    fontFamily: 'sans-serif',
  },
});

export default ExpenseCard;
