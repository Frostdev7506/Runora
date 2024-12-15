import React, {useRef, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import useStore from '../store/store'; // Adjust path as needed

const ExpenseCard = ({expense}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressOpacityAnim = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation();
  const deleteExpense = useStore(state => state.deleteExpense);

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


  const handleExpensePress = expense => {
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

      console.log("Month", month);
      
      console.log("Expense id", expense.id);
      console.log("Expense", expense);
      
      
      Alert.alert(
        "Delete Expense",
        "Are you sure you want to delete this expense?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: () => {
              deleteExpense(month, expense.id);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
     console.error("Expense or Expense id not defined", expense)
    }
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
      <TouchableOpacity
      activeOpacity={1}
       onPressIn={handlePressIn} 
       onPressOut={handlePressOut}
       onPress={() => handleExpensePress(expense)}
      >
        <LinearGradient colors={['#008080', '#00B4A2']} style={styles.gradient}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ flex: 3}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon name="calendar" size={18} color="#ffffff" />
                            <Text style={{ color: '#ffffff', marginLeft: 5, fontSize: 16 }}>{expense.date}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon name="tag" size={18} color="#ffffff" />
                            <Text style={{ color: '#ffffff', marginLeft: 5, fontSize: 16 }}>{expense.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon name="dollar" size={18} color="#ffffff" />
                            <Text style={{ color: '#ffffff', marginLeft: 5, fontSize: 16 }}>{String(expense.amount)}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 , alignItems: 'flex-end'}} >
                    <TouchableOpacity onPress={handleDelete} style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 5 }}>
                            <Ant name="delete" size={18} color="#ffffff" />

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