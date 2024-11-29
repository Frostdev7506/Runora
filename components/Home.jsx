import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useStore from '../store/store';
import ExpenseCard from './ExpenseCard';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(
    Array(5)
      .fill(0)
      .map(() => new Animated.Value(0)),
  );

  const {
    budgets,
    expenses,
    symbol,
    currency,
    region,
    monthlyBudget,
    loadFromStorage,
    addExpense,
    loading,
  } = useStore();
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  useEffect(() => {
    const initialize = async () => {
      await loadFromStorage();

      // Animate welcome tex
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // Animate stats cards after welcome text animation completes
        const cardAnimations = cardOpacity.current.map((cardOpac, index) => {
          return Animated.timing(cardOpac, {
            toValue: 1,
            duration: 500,
            delay: 100 * (index + 1),
            useNativeDriver: true,
          });
        });

        Animated.parallel(cardAnimations).start();
      });
    };

    initialize();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Default values to prevent undefined errors
  const monthlyBudgetValue = monthlyBudget || 0;
  const symbolValue = symbol || '$';
  const currencyValue = currency || 'USD';
  const regionValue = region || 'Global';

  // Calculate total expenses and total budget
  const totalExpenses = Object.keys(expenses || {}).reduce((total, month) => {
    return (
      total +
      (expenses[month] || []).reduce(
        (monthTotal, expense) => monthTotal + expense.amount,
        0,
      )
    );
  }, 0);

  const totalBudget = Object.keys(budgets || {}).reduce(
    (total, month) => total + (budgets[month] || 0),
    0,
  );

  // Flatten all expenses for display
  const allExpenses = Object.values(expenses || {}).flat();
  const handleAddExpense = () => {
    if (!expenseName || !expenseAmount || isNaN(expenseAmount)) {
      alert('Please provide valid expense details');
      return;
    }

    const selectedDate = date.toISOString().split('T')[0];
    addExpense(selectedDate, {
      date: selectedDate,
      name: expenseName,
      amount: parseFloat(expenseAmount),
    });
    setModalVisible(false);
    setExpenseName('');
    setExpenseAmount('');
  };

  const handleSettings = () => {
    // setModalVisible(false);
    navigation.navigate('Settings');
  };

  return (
    <LinearGradient colors={['#f5fcff', '#e0f7fa']} style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Animated.Text style={[styles.text, {opacity}]}>Home</Animated.Text>
        <TouchableOpacity style={styles.settingBtn} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color="#008080" />
        </TouchableOpacity>
      </View>

      <ScrollView
        scrollIndicatorInsets={{right: 1}}
        style={styles.expenseContainer}>
        <View style={styles.statsContainer}>
          {/* Monthly Budget Card */}
          <Animated.View
            style={[styles.statCard, {opacity: cardOpacity.current[0]}]}>
            <Icon name="bank" size={64} color="#008080" type="solid" />
            <Text style={styles.statValue}>
              {symbolValue} {monthlyBudgetValue}
            </Text>
            <Text style={styles.statLabel}>Monthly Budget</Text>
          </Animated.View>

          {/* Total Expenses Card y*/}
          <Animated.View
            style={[styles.statCard, {opacity: cardOpacity.current[1]}]}>
            <Icon name="shopping-cart" size={64} color="#008080" />
            <Text style={styles.statValue}>
              {symbolValue} {totalExpenses}
            </Text>
            <Text style={styles.statLabel}>Total Expenses</Text>
          </Animated.View>

          {/* Currency Card */}
          <Animated.View
            style={[styles.statCard, {opacity: cardOpacity.current[2]}]}>
            <Icon name="flag" size={64} color="#008080" />
            <Text style={styles.statValue}>{currencyValue}</Text>
            <Text style={styles.statLabel}>Currency</Text>
          </Animated.View>
        </View>

        {/* Expense Cards Section */}

        <View style={styles.expenseContainer}>
          {allExpenses.map((expense, index) => (
            <Animated.View
              key={index}
              style={[
                styles.expenseCard,
                {opacity: cardOpacity.current[3 + index]},
              ]}>
              <ExpenseCard expense={expense} />
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Expense Modal  yes*/}
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Icon name="times" size={24} color="#008080" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <View style={styles.datePickerInput}>
                    <Text>{date.toISOString().split('T')[0]}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Expense Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter expense name"
                  value={expenseName}
                  onChangeText={setExpenseName}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Expense Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter expense amount"
                  value={expenseAmount}
                  onChangeText={setExpenseAmount}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                style={styles.addButtonModal}
                onPress={handleAddExpense}>
                <Text style={styles.addButtonText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePickerModal
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || date;
                  setShowDatePicker(Platform.OS === 'ios');
                  setDate(currentDate);
                }}
              />
            )}
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  text: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
    marginBottom: 2,
    color: '#008080',
  },
  settingBtn: {
    fontSize: 28,
    alignSelf: 'flex-end',
    color: '#008080',
  },
  statsContainer: {
    width: '100%',
    marginTop: 5,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
    marginLeft: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#008080',
    marginLeft: 10,
  },
  expenseContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  expenseCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#008080',
    borderRadius: 30,
    padding: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#008080',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#008080',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  datePickerInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#008080',
  },
  addButtonModal: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default Home;
