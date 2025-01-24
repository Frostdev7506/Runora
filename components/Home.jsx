import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useStore from '../store/store';
import ExpenseCard from './ExpenseCard';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AnimatedTitle from './ReuseableComponents/AnimatedTitle';
import AddExpenseModal from './ReuseableComponents/AddExpenseModal';
import BackupMenu from './BackupMenu'; // Import the BackupMenu component

console.log('Home.jsx');

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
  const [showAdditionalCards, setShowAdditionalCards] = useState(false);
    const [backupModalVisible, setBackupModalVisible] = useState(false);


  useEffect(() => {
    const initialize = async () => {
      await loadFromStorage();
      // Animate welcome text
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

  const monthlyBudgetValue = monthlyBudget || 0;
  const symbolValue = symbol || '$';
  const currencyValue = currency || 'USD';
  const regionValue = region || 'Global';

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

  const allExpenses = Object.values(expenses || {}).flat();

  const handleAddExpense = (expenseData) => {
    const selectedMonth = expenseData.date.substring(0, 7);
    addExpense(selectedMonth, expenseData);
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };


  const handleOpenBackupMenu = () => {
    setBackupModalVisible(true);
  };
    const handleCloseBackupMenu = () => {
        setBackupModalVisible(false);
    };

  return (
    <LinearGradient colors={['#f5fcff', '#e0f7fa']} style={styles.container}>
      <View style={styles.headerStyles}>
        <Animated.Text style={[styles.text, { opacity }]}></Animated.Text>
        <AnimatedTitle>Home</AnimatedTitle>
        <TouchableOpacity style={styles.settingBtn} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color="#008080" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backupBtn} onPress={handleOpenBackupMenu}>
          <Icon name="save" size={24} color="#008080" />
        </TouchableOpacity>
      </View>
      <ScrollView scrollIndicatorInsets={{ right: 1 }} style={styles.expenseContainer}>
        <View style={styles.statsContainer}>
          {/* Total Expenses Card */}
          <Animated.View
            style={[
              styles.statCard,
              styles.cardShadow,
              { opacity: cardOpacity.current[1] },
            ]}>
            <Icon name="shopping-cart" size={64} color="#008080" />
            <Text style={styles.statLabel}>Total Expenses</Text>
            <Text style={styles.statValue}>
              {symbolValue} {totalExpenses}
            </Text>
          </Animated.View>
          {showAdditionalCards && (
            <>
              {/* Monthly Budget Card */}
              <Animated.View
                style={[
                  styles.statCard,
                  styles.cardShadow,
                  { opacity: cardOpacity.current[0] },
                ]}>
                <Icon name="bank" size={64} color="#008080" type="solid" />
                <Text style={styles.statLabel}>Monthly Budget</Text>
                <Text style={styles.statValue}>
                  {symbolValue} {monthlyBudgetValue}
                </Text>
              </Animated.View>

              {/* Currency Card */}
              <Animated.View
                style={[
                  styles.statCard,
                  styles.cardShadow,
                  { opacity: cardOpacity.current[2] },
                ]}>
                <Icon name="flag" size={64} color="#008080" />
                <Text style={styles.statLabel}>Currency</Text>
                <Text style={styles.statValue}>{currencyValue}</Text>
              </Animated.View>

              {/* Region Card */}
              <Animated.View
                style={[
                  styles.statCard,
                  styles.cardShadow,
                  { opacity: cardOpacity.current[3] },
                ]}>
                <Icon name="globe" size={64} color="#008080" />
                <Text style={styles.statLabel}>Region</Text>
                <Text style={styles.statValue}>{regionValue}</Text>
              </Animated.View>
            </>
          )}
        </View>

        {showAdditionalCards ? (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setShowAdditionalCards(false)}>
            <Text style={styles.showMoreButtonText}>Hide Additional Info</Text>
            <Icon name="angle-up" size={24} color="#008080" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setShowAdditionalCards(true)}>
            <Text style={styles.showMoreButtonText}>Show More Info</Text>
            <Icon name="angle-down" size={24} color="#008080" />
          </TouchableOpacity>
        )}

        {/* Recent Transactions Header */}
        <View style={styles.RecentTransactionsHeader}>
          <Text style={styles.recentTransactionsText}>Your recent expenses</Text>
        </View>

        {/* Expense Cards Section */}
        <View style={styles.expenseContainer}>
          {allExpenses.length > 0 ? (
            allExpenses.map((expense, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.expenseCard,
                  styles.cardShadow,
                  { opacity: cardOpacity.current[4 + index] },
                ]}>
                <ExpenseCard expense={expense} />
              </Animated.View>
            ))
          ) : (
            <Text style={styles.noExpensesText}>No recent expenses.</Text>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAddExpense={handleAddExpense}
      />

        {/* Backup Menu */}
        <BackupMenu visible={backupModalVisible} onClose={handleCloseBackupMenu} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerStyles: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
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
  backupBtn: {
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
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    flexDirection: 'column',
    alignItems: 'center',
    height: 180,
    justifyContent: 'space-around',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 18,
    color: '#008080',
    textAlign: 'center',
  },
  expenseContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  expenseCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
  showMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  RecentTransactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    borderWidth: 1,
    borderColor: '#00B4A2',
    padding: 12,
    borderRadius: 12,
    marginTop: 30,
  },
  recentTransactionsText: {
    fontSize: 18,
    color: '#008080',
    fontWeight: 'bold',
  },
  noExpensesText: {
    fontSize: 16,
    color: '#008080',
    textAlign: 'center',
    marginVertical: 20,
  },
  showMoreButtonText: {
    fontSize: 16,
    color: '#008080',
    marginRight: 5,
  },
});

export default Home;