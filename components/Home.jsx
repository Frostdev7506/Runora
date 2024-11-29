import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import useStore from '../store/store';
import ExpenseCard from './ExpenseCard'; // Adjust the path as necessary

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
    loading,
  } = useStore();

  useEffect(() => {
    loadFromStorage();

    // Animate welcome text
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

  return (
    <LinearGradient colors={['#f5fcff', '#e0f7fa']} style={styles.container}>
      <Animated.Text style={[styles.text, {opacity}]}>{'Home'}</Animated.Text>
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

        {/* Total Expenses Card */}
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
  text: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
    color: '#008080',
  },
  statsContainer: {
    width: '100%',
    marginTop: 20,
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
});

export default Home;
