// Home.jsx
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
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  Card,
  Title,
  Paragraph,
  IconButton,
  FAB,
  Portal,
  Modal as PaperModal,
  Divider,
  Button,
} from 'react-native-paper';
import CustomPieChart from './CustomPieChart'; // Import the pie chart


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
  } = useStore();
  const navigation = useNavigation();
  const expenses = useStore(state => state.expenses || []);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showAdditionalCards, setShowAdditionalCards] = useState(false);
  const [backupModalVisible, setBackupModalVisible] = useState(false);

  // --- Chart Variables ---
  const chartSize = 250; // Diameter of the pie chart

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

   // --- Calculate Current Month's Data ---
  const currentMonth = new Date().toISOString().substring(0, 7);
  const currentMonthBudget = budgets[currentMonth] || monthlyBudget || 0;
  const currentMonthExpenses = expenses[currentMonth]?.reduce((sum, expense) => sum + expense.amount, 0) || 0;



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
                {/*  You can add an animated welcome message here if needed */}
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
                <Animated.View style={[styles.card, { opacity: cardOpacity[0] }]}>
                  <Card style={styles.cardContent}>
                    <Card.Content style={styles.cardContentContainer}>
                      <View style={styles.iconAndTextContainer}>
                        <Icon name="shopping-cart" size={30} color="#008080" />
                        <Title style={styles.cardTitle}>Total Expenses</Title>
                      </View>
                      <Paragraph style={styles.cardParagraph}>
                        {symbolValue} {totalExpenses}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                </Animated.View>


                {showAdditionalCards && (
                  <>
                    <Animated.View style={[styles.card, { opacity: cardOpacity[1] }]}>
                      <Card style={styles.cardContent}>
                        <Card.Content style={styles.cardContentContainer}>
                          <View style={styles.iconAndTextContainer}>
                            <Icon name="bank" size={30} color="#008080" />
                            <Title style={styles.cardTitle}>Monthly Budget</Title>
                          </View>
                          <Paragraph style={styles.cardParagraph}>
                            {symbolValue} {monthlyBudgetValue}
                          </Paragraph>
                        </Card.Content>
                      </Card>
                    </Animated.View>

                    <Animated.View style={[styles.card, { opacity: cardOpacity[2] }]}>
                      <Card style={styles.cardContent}>
                        <Card.Content style={styles.cardContentContainer}>
                          <View style={styles.iconAndTextContainer}>
                            <Icon name="money" size={30} color="#008080" />
                            <Title style={styles.cardTitle}>Remaining Budget</Title>
                          </View>
                          <Paragraph style={styles.cardParagraph}>
                            {symbolValue} {remainingBalance}
                          </Paragraph>
                        </Card.Content>
                      </Card>
                    </Animated.View>

                    <Animated.View style={[styles.card, { opacity: cardOpacity[3] }]}>
                      <Card style={styles.cardContent}>
                        <Card.Content style={styles.cardContentContainer}>
                          <View style={styles.iconAndTextContainer}>
                            <Icon name="flag" size={30} color="#008080" />
                            <Title style={styles.cardTitle}>Currency</Title>
                          </View>
                          <Paragraph style={styles.cardParagraph}>{currencyValue}</Paragraph>
                        </Card.Content>
                      </Card>
                    </Animated.View>
                    <Animated.View style={[styles.card, { opacity: cardOpacity[4] }]}>
                      <Card style={styles.cardContent}>
                        <Card.Content style={styles.cardContentContainer}>
                          <View style={styles.iconAndTextContainer}>
                            <Icon name="globe" size={30} color="#008080" />
                            <Title style={styles.cardTitle}>Region</Title>
                          </View>
                          <Paragraph style={styles.cardParagraph}>{regionValue}</Paragraph>
                        </Card.Content>
                      </Card>
                    </Animated.View>
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

              {/* --- Custom Pie Chart --- */}
              <View style={styles.chartContainer}>
              <CustomPieChart
                budget={currentMonthBudget}
                expenses={currentMonthExpenses}
                symbol={symbolValue}
                chartSize={chartSize}
              />
                  <Text style={styles.chartLabelText}>{currentMonth}</Text>
              </View>

              <Divider style={styles.divider} />
              <Title style={styles.recentTransactionsTitle}>Your Recent Expenses</Title>

              <View style={styles.expenseCardsContainer}>
                {allExpenses.length > 0 ? (
                  allExpenses.map((expense, index) => (
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
  card: {
    marginBottom: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backgroundColor: 'transparent',
  },
  cardContent: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    minHeight: 100,

  },
  cardContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    marginLeft: 10,
    color: '#008080',
  },
  cardParagraph: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
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
    // Add spacing or other styles if needed
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
    chartContainer:{
      alignItems: 'center',
      marginTop: 20
  }

});

export default Home;