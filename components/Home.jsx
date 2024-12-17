import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useStore from '../store/store';
import ExpenseCard from './ExpenseCard';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import AnimatedTitle from './ReuseableComponents/AnimatedTitle';
import AnimatedTouchable from './ReuseableComponents/AnimatedTouchable';
import AddExpenseModal from './ReuseableComponents/AddExpenseModal';


const Home = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(
    Array(5)
      .fill(0)
      .map(() => new Animated.Value(0)),
  );

  const {
    budgets,
    symbol,
    currency,
    region,
    monthlyBudget,
    loadFromStorage,
    addExpense,
    loading,
  } = useStore();
  const navigation = useNavigation();

  const expenses = useStore(state => state.expenses || []);

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await loadFromStorage();

      // Animate welcome tex
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // Animate stats cards after welcome text animation completes
        const cardAnimations = cardOpacity.current.map((cardOpac, index) => {
          return Animated.timing(cardOpac, {
            toValue: 1,
            duration: 400,
             delay: 50 * (index + 1),
            easing: Easing.ease,
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

  const handleAddExpense = (expenseData) => {
    const selectedMonth = expenseData.date.substring(0, 7);
    addExpense(selectedMonth, expenseData);
  };


  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <LinearGradient colors={['#f5fcff', '#e0f7fa']} style={styles.container}>
      <View style={styles.headerStyles}>
        <Animated.Text style={[styles.text, {opacity}]}></Animated.Text>
        <AnimatedTitle>Home</AnimatedTitle>
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
            <Text style={styles.statLabel}>Monthly Budget</Text>

            <Text style={styles.statValue}>
              {symbolValue} {monthlyBudgetValue}
            </Text>
          </Animated.View>

          {/* Total Expenses Card y*/}
          <Animated.View
            style={[styles.statCard, {opacity: cardOpacity.current[1]}]}>
            <Icon name="shopping-cart" size={64} color="#008080" />
            <Text style={styles.statLabel}>Total Expenses</Text>

            <Text style={styles.statValue}>
              {symbolValue} {totalExpenses}
            </Text>
          </Animated.View>

          {/* Currency Card */}
          <Animated.View
            style={[styles.statCard, {opacity: cardOpacity.current[2]}]}>
            <Icon name="flag" size={64} color="#008080" />
            <Text style={styles.statLabel}>Currency</Text>

            <Text style={styles.statValue}>{currencyValue}</Text>
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

      <AnimatedTouchable onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Icon name="plus" size={24} color="#ffffff" />
      </AnimatedTouchable>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAddExpense={handleAddExpense}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerStyles: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
    marginLeft: 10,
  },
  statLabel: {
    fontSize: 18,
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
});

export default Home;