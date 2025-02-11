// Home.jsx (Modified)
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Easing,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Keep this import
import useStore from '../store/store';
import ExpenseCard from './ExpenseCard';
import { useNavigation } from '@react-navigation/native';
import AnimatedTitle from './ReuseableComponents/AnimatedTitle';
import AddExpenseModal from './ReuseableComponents/AddExpenseModal';
import BackupMenu from './BackupMenu';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Provider as PaperProvider,
  Text,
  IconButton,
  FAB,
  Portal,
  Modal as PaperModal,
  Divider,
  Button,
  Title,
} from 'react-native-paper';
import CustomPieChart from './ReuseableComponents/CustomPieChart';
import SummaryCard from './ReuseableComponents/SummaryCard';


const Home = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(
    Array(5)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current;
  const {
    budgets,
    symbol,
    currency,
    region,
    monthlyBudget,
    loadFromStorage,
    addExpense,
    loading,
    remainingBalance,
    getExpenses,
    getTags
  } = useStore();
  const navigation = useNavigation();
  const expenses = useStore(state => state.expenses || []);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showAdditionalCards, setShowAdditionalCards] = useState(false);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const tags = getTags();


  const chartSize = 250;

  useEffect(() => {
    const initialize = async () => {
      await loadFromStorage();
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        const cardAnimations = cardOpacity.map((cardOpac, index) => {
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
  }, [loadFromStorage]);

  useEffect(() => {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthExpenses = getExpenses(currentMonth) || [];
    setCurrentMonthExpenses(monthExpenses);
  }, [expenses, getExpenses]);

  const currentMonth = new Date().toISOString().substring(0, 7);
  const currentMonthBudget = budgets[currentMonth] || monthlyBudget || 0;
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0) || 0;
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


  const filteredExpenses = selectedTag
    ? allExpenses.filter(expense => expense.tags && expense.tags.includes(selectedTag))
    : allExpenses;


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


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <LinearGradient colors={['#f5fcff', '#e0f7fa']} style={styles.linearGradient}>
            <View style={styles.headerStyles}>
              <Animated.View style={{ opacity }}>
              </Animated.View>
              <Text style={styles.headerTitle}>
                <AnimatedTitle>Home</AnimatedTitle>
              </Text>

              <View style={styles.iconContainer}>
                <IconButton
                  icon="cog-outline"
                  iconColor="#008080"
                  size={28}
                  onPress={handleSettings}
                />
                <IconButton
                  icon="cloud-upload-outline"
                  iconColor="#008080"
                  size={28}
                  onPress={handleOpenBackupMenu}
                />
              </View>
            </View>

            <ScrollView
              style={styles.scrollView}
              scrollIndicatorInsets={{ right: 1 }}
            >
              <View style={styles.statsContainer}>
                {/* Use the SummaryCard component */}
                <SummaryCard
                  iconName="shopping-cart"
                  title="Total Expenses"
                  value={totalExpenses}
                  symbol={symbolValue}
                  opacity={cardOpacity[2]}
                />

                {showAdditionalCards && (
                  <>
                    <SummaryCard
                      iconName="bank"
                      title="Monthly Budget"
                      value={monthlyBudgetValue}
                      symbol={symbolValue}
                      opacity={cardOpacity[2]}
                    />
                    <SummaryCard
                      iconName="money"
                      title="Remaining Budget"
                      value={remainingBalance}
                      symbol={symbolValue}
                      opacity={cardOpacity[2]}
                    />

                    <SummaryCard
                      iconName="flag"
                      title="Currency"
                      value={currencyValue}
                      symbol=""
                      opacity={cardOpacity[3]}
                    />

                    <SummaryCard
                      iconName="globe"
                      title="Region"
                      value={regionValue}
                      symbol=""
                      opacity={cardOpacity[4]}
                    />
                  </>
                )}
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  icon={showAdditionalCards ? 'arrow-collapse-up' : 'arrow-collapse-down'}
                  mode="contained"
                  buttonColor="#008080"
                  textColor="#ffffff"
                  onPress={() => setShowAdditionalCards(!showAdditionalCards)}
                  style={styles.showMoreButton}
                >
                  {showAdditionalCards ? 'Hide Info' : 'Show More Info'}
                </Button>
              </View>

              <View style={styles.chartContainer}>
                <CustomPieChart
                  budget={currentMonthBudget}
                  expenses={currentMonthTotal}
                  symbol={symbolValue}
                  chartSize={chartSize}
                />
                <Text style={styles.chartLabelText}>{currentMonth}</Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.tagFilterContainer}>
                <Text style={styles.recentTransactionsTitle}>Filter by Tag:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.tagButton,
                      !selectedTag && styles.tagButtonSelected,
                    ]}
                    onPress={() => setSelectedTag(null)}
                  >
                    <Text
                      style={[
                        styles.tagButtonText,
                        !selectedTag && styles.tagButtonTextSelected,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {tags.map((tag) => (
                    <TouchableOpacity
                      key={tag.id}
                      style={[
                        styles.tagButton,
                        selectedTag === tag.id && styles.tagButtonSelected,
                        { backgroundColor: tag.color },
                      ]}
                      onPress={() => setSelectedTag(tag.id)}
                    >
                      <Text
                        style={[
                          styles.tagButtonText,
                          selectedTag === tag.id && styles.tagButtonTextSelected,
                        ]}
                      >
                        {tag.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Title style={styles.recentTransactionsTitle}>Your Recent Expenses</Title>

              <View style={styles.expenseCardsContainer}>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense, index) => (
                    <ExpenseCard key={index} expense={expense} />
                  ))
                ) : (
                  <Text style={styles.noExpensesText}>No recent expenses.</Text>
                )}
              </View>
            </ScrollView>

            <Portal>
              <FAB
                style={styles.fab}
                icon="plus"
                color="#ffffff"
                onPress={() => setModalVisible(true)}
              />
            </Portal>


            <PaperModal
              visible={isModalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <AddExpenseModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onAddExpense={handleAddExpense}
              />
            </PaperModal>

            <PaperModal
              visible={backupModalVisible}
              onDismiss={handleCloseBackupMenu}
              contentContainerStyle={styles.modalContainer}
            >
              <BackupMenu visible={backupModalVisible} onClose={handleCloseBackupMenu} />
            </PaperModal>
          </LinearGradient>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  headerStyles: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  expenseCardsContainer: {
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#008080',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  recentTransactionsTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: '#008080',
    textAlign: 'center',
  },
  noExpensesText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  divider: {
    marginTop: 30,
    marginBottom: 10,
  },
  showMoreButton: {
  },
  buttonContainer: {
    alignItems: 'center',
  },
  chartLabelText: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  tagFilterContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  tagButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ddd',
  },
  tagButtonSelected: {
    backgroundColor: '#008080',
  },
  tagButtonText: {
    fontSize: 14,
    color: '#333',
  },
  tagButtonTextSelected: {
    color: '#fff',
  },

});

export default Home;