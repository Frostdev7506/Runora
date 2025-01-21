import React, { useRef, useEffect } from 'react';
import {
  View,
  Alert,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ant from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/store';

const ExpenseCard = ({ expense }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressOpacityAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const deleteExpense = useStore((state) => state.deleteExpense);

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
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

  const handleExpensePress = (expense) => {
    let month = expense.date.substring(0, 7);
    navigation.navigate('EditExpense', {
      ...expense,
      month: month,
      expenseId: expense?.id,
      date: expense.date,
    });
  };

  const handleDelete = () => {
    if (expense && expense.id) {
      let month = expense.date.substring(0, 7);
      Alert.alert(
        'Delete Expense',
        'Are you sure you want to delete this expense?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              deleteExpense(month, expense.id);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      console.error('Expense or Expense id not defined', expense);
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, pressOpacityAnim._value],
          }),
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => handleExpensePress(expense)}
        style={{ borderRadius: 16, overflow: 'hidden' }}
      >
        <LinearGradient colors={['#008080', '#00B4A2']} style={styles.gradient}>
          <View style={styles.content}>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Icon name="calendar" size={18} color="#ffffff" style={styles.icon} />
                <Text style={styles.infoText}>{expense.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="tag" size={18} color="#ffffff" style={styles.icon} />
                <Text style={styles.infoText}>{expense.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="dollar" size={18} color="#ffffff" style={styles.icon} />
                <Text style={styles.infoText}>{String(expense.amount)}</Text>
              </View>
            </View>
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Ant name="delete" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16, // Increased spacing between cards
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    paddingVertical: 20, // Increased padding for better spacing
    paddingHorizontal: 24, // Increased padding for better spacing
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Increased spacing between rows
  },
  icon: {
    marginRight: 8, // Increased spacing between icon and text
  },
  infoText: {
    color: '#ffffff',
    fontSize: 18, // Increased font size for better readability
  },
  deleteButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  deleteButton: {
    padding: 10, // Increased padding for better touch area
  },
});

export default ExpenseCard;