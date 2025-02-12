import React, { useState, useCallback, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Portal,
  Surface,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import TagSelector from './TagSelector';

const DatePickerButton = memo(({ date, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.datePickerInput}>
      <Text style={styles.datePickerText}>{date.toLocaleDateString()}</Text>
    </View>
  </TouchableOpacity>
));

const AddButton = memo(({ onPress }) => (
  <TouchableOpacity style={styles.addButtonModal} onPress={onPress}>
    <Text style={styles.addButtonText}>Add Expense</Text>
  </TouchableOpacity>
));

const CloseButton = memo(({ onPress }) => (
  <TouchableOpacity style={styles.closeButton} onPress={onPress}>
    <Icon name="times" size={24} color="#008080" />
  </TouchableOpacity>
));

const AddExpenseModal = ({ isVisible, onClose, onAddExpense }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const handleAddExpense = useCallback(() => {
    if (!expenseName || !expenseAmount || isNaN(expenseAmount)) {
      alert('Please provide valid expense details');
      return;
    }

    // Format date as YYYY-MM
    const month = date.toISOString().slice(0, 7);
    // Format full date as YYYY-MM-DD
    const fullDate = date.toISOString().split('T')[0];
    
    const expenseData = {
      date: fullDate,
      name: expenseName.trim(),
      amount: parseFloat(expenseAmount),
      tags: selectedTags,
    };

    onAddExpense({
      month,
      expense: expenseData
    });
    
    // Reset form
    onClose();
    setExpenseName('');
    setExpenseAmount('');
    setSelectedTags([]);
    setDate(new Date());
  }, [date, expenseName, expenseAmount, selectedTags, onAddExpense, onClose]);

  const handleDateChange = useCallback((event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  }, [date]);

  const showDatePickerModal = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  return (
    <Portal>
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <Surface style={styles.modalContent}>
            <CloseButton onPress={onClose} />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
              <Text style={styles.modalTitle}>Add Expense</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date</Text>
                <DatePickerButton date={date} onPress={showDatePickerModal} />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Expense Name</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Enter expense name"
                  value={expenseName}
                  onChangeText={setExpenseName}
                  style={styles.input}
                  outlineColor="#008080"
                  activeOutlineColor="#008080"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Amount</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Enter amount"
                  value={expenseAmount}
                  onChangeText={setExpenseAmount}
                  keyboardType="numeric"
                  style={styles.input}
                  outlineColor="#008080"
                  activeOutlineColor="#008080"
                />
              </View>

              <TagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />

              <AddButton onPress={handleAddExpense} />
            </ScrollView>

            {showDatePicker && (
              <DateTimePickerModal
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
          </Surface>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scrollView: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#008080',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#008080',
  },
  input: {
    backgroundColor: '#f0f0f0',
  },
  datePickerInput: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#008080',
  },
  addButtonModal: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default memo(AddExpenseModal);