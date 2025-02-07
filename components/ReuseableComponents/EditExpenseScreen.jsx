import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useStore from '../../store/store';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import {
  Text,
  TextInput,
  Button,
  IconButton,
  Surface,
  Card,
  Title,
  useTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import TagSelector from './TagSelector';

const EditExpenseScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { month, expenseId, date: expenseDate, name, amount, tags: initialTags = [] } = route.params;

  const updateExpense = useStore(state => state.updateExpense);
  const getExpenses = useStore(state => state.getExpenses);
  const getTags = useStore(state => state.getTags);
  const allTags = getTags();

  const [expenseName, setExpenseName] = useState(name || '');
  const [expenseAmount, setExpenseAmount] = useState(String(amount) || '');
  const [date, setDate] = useState(new Date());
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const expenses = getExpenses(month);
    const expense = expenses.find(e => e.id === expenseId);

    if (expense) {
      const parsedDate = new Date(expense.date);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        setExpenseName(expense.name);
        setExpenseAmount(String(expense.amount));
        setSelectedTags(expense.tags || []);
      }
    } else if (expenseDate) {
      const parsedDate = new Date(expenseDate);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    }
  }, [month, expenseId, getExpenses, expenseDate]);

  const handleUpdateExpense = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    if (!expenseName.trim()) {
      alert('Please enter an expense name');
      setIsLoading(false);
      return;
    }

    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      setIsLoading(false);
      return;
    }

    const selectedTagObjects = selectedTags.map(tagId => 
      allTags.find(tag => tag.id === tagId)
    ).filter(Boolean);

    try {
      const updatedExpense = {
        name: expenseName.trim(),
        amount: amount,
        date: date.toISOString().split('T')[0],
        tags: selectedTags,
        category: selectedTagObjects[0]?.name || 'other',
      };

      await updateExpense(month, expenseId, updatedExpense);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [expenseName, expenseAmount, date, selectedTags, month, expenseId, updateExpense, navigation, allTags, isLoading]);

  const handleDateChange = useCallback((event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setDatePickerVisibility(false);
  }, []);

  return (
    <PaperProvider>
      <Surface style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Edit Expense</Title>
              <Image 
                source={require('../../assets/EditExpnse.png')}
                style={styles.headerImage}
                resizeMode="contain"
              />
              <TextInput
                mode="outlined"
                label="Expense Name"
                value={expenseName}
                onChangeText={setExpenseName}
                style={styles.input}
                outlineColor="#008080"
                activeOutlineColor="#008080"
                left={<TextInput.Icon icon="pencil" color="#008080" />}
              />

              <TextInput
                mode="outlined"
                label="Amount"
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                keyboardType="numeric"
                style={styles.input}
                outlineColor="#008080"
                activeOutlineColor="#008080"
                left={<TextInput.Icon icon="currency-usd" color="#008080" />}
              />

              <Button 
                mode="outlined"
                onPress={() => setDatePickerVisibility(true)}
                style={styles.dateButton}
                icon="calendar"
                textColor="#008080"
              >
                {date ? date.toLocaleDateString() : 'Select Date'}
              </Button>

              <TagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />

              {isDatePickerVisible && (
                <DateTimePickerModal
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  onCancel={() => setDatePickerVisibility(false)}
                />
              )}

              <Button
                mode="contained"
                onPress={handleUpdateExpense}
                style={styles.updateButton}
                buttonColor="#008080"
                loading={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Expense'}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </Surface>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  headerImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  dateButton: {
    marginBottom: 24,
    borderColor: '#008080',
  },
  updateButton: {
    paddingVertical: 8,
    marginTop: 16,
  },
});

export default EditExpenseScreen;