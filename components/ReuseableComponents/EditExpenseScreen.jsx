import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useStore from '../../store/store';
import DateTimePickerModal from '@react-native-community/datetimepicker';

const EditExpenseScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { month, expenseId, date: expenseDate, name, amount } = route.params;

    console.log("route params", typeof amount);


    const updateExpense = useStore(state => state.editExpense);
    const getExpenses = useStore(state => state.getExpenses);

    const [expenseName, setExpenseName] = useState(name || '');
    const [expenseAmount, setExpenseAmount] = useState(String(amount) || '');
    const [date, setDate] = useState(new Date()); // Initialize with a valid Date object
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    useEffect(() => {
        const expenses = getExpenses(month);
        console.log('Expenses:------------', expenses);

        const expense = expenses.find(e => e.id === expenseId);

        console.log("Selected Expense", expense);
        

        if (expense) {
            // Parse the date and ensure it's valid
            const parsedDate = new Date(expense.date);
            if (isNaN(parsedDate.getTime())) {
                console.error('Invalid date:', expense.date);
                setDate(new Date()); // Fallback to current date if invalid
            } else {
                setDate(parsedDate);
                setExpenseName(expense.name);
                setExpenseAmount(String(expense.amount));
            }
        } else if (expenseDate) {
            // Parse the date and ensure it's valid
            const parsedDate = new Date(expenseDate);
            if (isNaN(parsedDate.getTime())) {
                setDate(new Date()); // Fallback to current date if invalid
            } else {
                setDate(parsedDate);
            }
        }
    }, [month, expenseId, getExpenses, expenseDate]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        hideDatePicker();
    };

    const handleUpdateExpense = () => {
        const updatedExpense = {
            name: expenseName,
            amount: parseFloat(expenseAmount),
            date: date.toISOString().split('T')[0],
        };
        updateExpense(month, expenseId, updatedExpense);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Expense Name"
                value={expenseName}
                onChangeText={setExpenseName}
            />
            <TextInput
                style={styles.input}
                placeholder="Expense Amount"
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                keyboardType="numeric"
            />

            <TouchableOpacity onPress={showDatePicker}>
                <View style={styles.datePickerButton}>
                    <Text style={styles.datePickerButtonText}>
                        {date ? date.toLocaleDateString() : 'Select Date'}
                    </Text>
                </View>
            </TouchableOpacity>

            {isDatePickerVisible && (
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    value={date}
                />
            )}

            <Button title="Update Expense" onPress={handleUpdateExpense} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    datePickerButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    datePickerButtonText: {
        fontSize: 16,
        color: '#333',
    },
    // Add more styles as needed
});

export default EditExpenseScreen;