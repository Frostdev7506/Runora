import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from '@react-native-community/datetimepicker';

const AddExpenseModal = ({ isVisible, onClose, onAddExpense }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const handleAddExpense = () => {
    if (!expenseName || !expenseAmount || isNaN(expenseAmount)) {
      alert('Please provide valid expense details');
      return;
    }

    const selectedDate = date.toISOString().split('T')[0];
    onAddExpense({
      date: selectedDate,
      name: expenseName,
      amount: parseFloat(expenseAmount),
    });
    onClose();
    setExpenseName('');
    setExpenseAmount('');
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="times" size={24} color="#008080" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Expense</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={styles.datePickerInput}>
                <Text style={styles.datePickerText}>{date.toLocaleDateString()}</Text>
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
              placeholderTextColor="#757575"
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
              placeholderTextColor="#757575"
            />
          </View>
          <TouchableOpacity style={styles.addButtonModal} onPress={handleAddExpense}>
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
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Subtle backdrop
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24, // Increased padding
    borderRadius: 16, // Rounded corners
    width: '90%', // Wider modal
    alignItems: 'center',
    elevation: 8, // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 28, // Larger title
    fontWeight: 'bold',
    marginBottom: 24, // More margin below the title
    color: '#008080',
    textAlign: 'center', // Center the title
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16, // More spacing
    alignItems: 'flex-start',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#008080',
  },
  input: {
    backgroundColor: '#f0f0f0',
     padding: 14,
    borderRadius: 12, // Rounded input fields
     width: '100%',
      fontSize: 16, // Increased input text size
     color: '#333'
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
    width: 270,
    
    borderRadius: 12,
    color: '#008080',
    alignSelf: 'flex-start',
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

export default AddExpenseModal;