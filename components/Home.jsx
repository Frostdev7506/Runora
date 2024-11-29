import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Easing} from 'react-native';
import useStore from '../store/store'; // Adjust the path as necessary

const Home = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  const {
    budgets,
    expenses,
    symbol,
    currency,
    region,
    monthlyBudget,
    loadFromStorage,
  } = useStore();

  useEffect(() => {
    loadFromStorage();
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [loadFromStorage, opacity]);

  const totalExpenses = Object.keys(expenses).reduce((total, month) => {
    return (
      total +
      expenses[month].reduce((monthTotal, expense) => monthTotal + expense, 0)
    );
  }, 0);

  const totalBudget = Object.keys(budgets).reduce(
    (total, month) => total + budgets[month],
    0,
  );

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, {opacity}]}>
        Welcome to Runora
      </Animated.Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          Monthly Budget: {symbol} {monthlyBudget}
        </Text>
        <Text style={styles.detailText}>
          Total Budget: {symbol} {totalBudget}
        </Text>
        <Text style={styles.detailText}>
          Total Expenses: {symbol} {totalExpenses}
        </Text>
        <Text style={styles.detailText}>Currency: {currency}</Text>
        <Text style={styles.detailText}>Region: {region}</Text>
      </View>
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
  text: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
    color: '#008080', // Turquoise accent color
  },
  detailsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 5,
    color: '#008080', // Turquoise accent color
  },
});

export default Home;
